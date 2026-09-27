export const meta = {
    name: 'fabrizioduroni-blog-sdlc',
    description: 'Build an Approved Plan Wave by Wave: parallel Work Units with Unit Reviews, then Full Checks and an Integration Review',
    whenToUse: 'Dispatched by the /fabrizioduroni-blog-sdlc skill after the Human Gate; never started on its own.',
    phases: [
        { title: 'Work Units', detail: 'implement ⇄ Unit Review per Work Unit, Wave by Wave' },
        { title: 'Merge', detail: 'merge the Work Unit branches of a parallel Wave into the feature branch' },
        { title: 'Integration', detail: 'Full Checks, Integration Review and live QA on everything combined' },
    ],
}

const A = typeof args === 'string' ? JSON.parse(args) : args
const MAX_WAVE = 3
const maxUnitRounds = A.maxUnitRounds || 2
const maxIntegrationRounds = A.maxIntegrationRounds || 2
const resolutions = A.resolutions || {}

const CHECK = { type: 'string', enum: ['pass', 'fail', 'skipped'] }
const UNIT_CHECKS = {
    type: 'object',
    properties: { lint: CHECK, validateArchitecture: CHECK, typecheck: CHECK, testRun: CHECK },
    required: ['lint', 'validateArchitecture', 'typecheck', 'testRun'],
}
const IMPLEMENT_SCHEMA = {
    type: 'object',
    properties: {
        status: { type: 'string', enum: ['done', 'blocked'] },
        baseSha: { type: 'string', description: 'HEAD of the branch you worked on, recorded before your first commit' },
        summary: { type: 'string' },
        commits: { type: 'array', items: { type: 'string' } },
        unitChecks: UNIT_CHECKS,
        checksOutput: { type: 'string', description: 'the tail of each check run, real output' },
        blockers: { type: 'array', items: { type: 'string' }, description: 'why you stopped, e.g. a file you do not own' },
        uncertainties: { type: 'array', items: { type: 'string' } },
    },
    required: ['status', 'baseSha', 'summary', 'commits', 'unitChecks', 'checksOutput', 'blockers'],
}
const FIX_SCHEMA = {
    type: 'object',
    properties: {
        status: { type: 'string', enum: ['done', 'blocked'] },
        resolutions: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    outcome: { type: 'string', enum: ['fixed', 'rebutted'] },
                    note: { type: 'string' },
                },
                required: ['id', 'outcome', 'note'],
            },
        },
        commits: { type: 'array', items: { type: 'string' } },
        unitChecks: UNIT_CHECKS,
        checksOutput: { type: 'string' },
        blockers: { type: 'array', items: { type: 'string' } },
    },
    required: ['status', 'resolutions', 'commits', 'unitChecks', 'checksOutput', 'blockers'],
}
const FINDING = {
    type: 'object',
    properties: {
        id: { type: 'string', description: 'B1, B2, …; keep the same id for the same finding across rounds' },
        file: { type: 'string' },
        summary: { type: 'string' },
        direction: { type: 'string' },
    },
    required: ['id', 'summary', 'direction'],
}
const REVIEW_SCHEMA = {
    type: 'object',
    properties: {
        verdict: { type: 'string', enum: ['PASS', 'CHANGES_REQUIRED'] },
        blocking: { type: 'array', items: FINDING },
        nonBlocking: { type: 'array', items: { type: 'string' } },
        rebuttalDecisions: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    decision: { type: 'string', enum: ['withdraw', 'reassert'] },
                    reason: { type: 'string' },
                },
                required: ['id', 'decision', 'reason'],
            },
        },
    },
    required: ['verdict', 'blocking', 'nonBlocking', 'rebuttalDecisions'],
}
const GATE_SCHEMA = {
    type: 'object',
    properties: {
        verdict: { type: 'string', enum: ['GREEN', 'RED', 'ENVIRONMENT'] },
        checks: {
            type: 'object',
            properties: {
                lint: CHECK, validateArchitecture: CHECK, knip: CHECK, typecheck: CHECK,
                testRun: CHECK, build: CHECK, testE2e: CHECK,
            },
            required: ['lint', 'validateArchitecture', 'knip', 'typecheck', 'testRun', 'build', 'testE2e'],
        },
        touchesUi: { type: 'boolean' },
        failures: { type: 'string', description: 'per failing check: the file/test/rule and a 5–20 line excerpt' },
        environment: { type: 'string' },
    },
    required: ['verdict', 'checks', 'touchesUi', 'failures', 'environment'],
}
const SENTINEL_SCHEMA = {
    type: 'object',
    properties: {
        verdict: { type: 'string', enum: ['PASS', 'FAIL', 'SETUP_ISSUE'] },
        blocking: { type: 'array', items: FINDING },
        nonBlocking: { type: 'array', items: { type: 'string' } },
    },
    required: ['verdict', 'blocking', 'nonBlocking'],
}
const MERGE_SCHEMA = {
    type: 'object',
    properties: {
        merged: { type: 'array', items: { type: 'string' } },
        conflicts: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    files: { type: 'array', items: { type: 'string' } },
                    reason: { type: 'string' },
                },
                required: ['id', 'files', 'reason'],
            },
        },
        installed: { type: 'boolean', description: 'whether you re-ran npm install after merging' },
    },
    required: ['merged', 'conflicts', 'installed'],
}

function waves(units) {
    const done = new Set()
    const left = units.slice()
    const result = []
    while (left.length) {
        const ready = left.filter((u) => (u.dependsOn || []).every((d) => done.has(d)))
        if (!ready.length) {
            throw new Error(`Work Unit Graph has a cycle or an unknown dependency among: ${left.map((u) => u.id).join(', ')}`)
        }
        if (ready.length > MAX_WAVE) {
            throw new Error(`Wave of ${ready.length} Work Units exceeds the cap of ${MAX_WAVE}: split the plan into two PRs`)
        }
        result.push(ready)
        ready.forEach((u) => {
            done.add(u.id)
            left.splice(left.indexOf(u), 1)
        })
    }
    return result
}

const context = [
    `Approved Plan (already approved by Fabrizio at the Human Gate; do NOT reopen it): ${A.planFile}`,
    A.explorationFile ? `Exploration report: ${A.explorationFile}` : '',
    A.docs && A.docs.length ? `Glossary / ADRs agreed for this change (use their terms): ${A.docs.join(', ')}` : '',
    `Repository (the pipeline worktree): ${A.repoRoot}`,
    `Feature branch: ${A.featureBranch} · base: ${A.baseBranch || 'main'} · mode: ${A.mode || 'feature'}`,
].filter(Boolean).join('\n')

function worktreeOf(unit) {
    return `${A.repoRoot}/.claude/worktrees/${A.slug}-${unit.id.toLowerCase()}`
}

function branchOf(unit) {
    return `wu/${A.slug}/${unit.id.toLowerCase()}`
}

function unitHeader(unit, isolated) {
    const where = isolated
        ? `Location: its OWN worktree at ${worktreeOf(unit)} on branch ${branchOf(unit)}, based on ${A.featureBranch}. ` +
          'Other Work Units are being built in parallel in their own worktrees; never touch the shared tree.'
        : `Location: the shared tree at ${A.repoRoot}, on ${A.featureBranch}.`
    return [
        context,
        '',
        `Work Unit ${unit.id}: ${unit.title}`,
        `Owns (touch only these and their co-located tests): ${(unit.owns || []).join(', ')}`,
        `Depends on (already merged into ${A.featureBranch}): ${(unit.dependsOn || []).join(', ') || 'none'}`,
        where,
    ].join('\n')
}

function listFindings(findings) {
    return findings.map((f) => `${f.id}. ${f.file ? f.file + ' — ' : ''}${f.summary}\n   Direction: ${f.direction}`).join('\n')
}

function reviewOpen(review, rebutted) {
    const reasserted = (review.rebuttalDecisions || []).filter((d) => d.decision === 'reassert')
    const withdrawn = new Set((review.rebuttalDecisions || []).filter((d) => d.decision === 'withdraw').map((d) => d.id))
    const blocking = review.blocking.filter((f) => !withdrawn.has(f.id))
    return { blocking, reasserted: reasserted.filter((d) => rebutted.includes(d.id)) }
}

async function runUnit(unit, isolated) {
    const header = unitHeader(unit, isolated)
    const label = (step) => `${unit.id}:${step}`
    const record = { id: unit.id, title: unit.title, status: 'converged', rounds: 0, commits: [], blocking: [], nonBlocking: [] }
    const firstRound = isolated
        ? `First create the worktree: \`git worktree add ${worktreeOf(unit)} -b ${branchOf(unit)} ${A.featureBranch}\`, ` +
          'then `npm install` inside it, then record `git rev-parse HEAD` there as baseSha.'
        : 'Record `git rev-parse HEAD` as baseSha before your first commit.'
    const fixMode = A.mode === 'fix'
        ? 'This is a bug fix: strict red-green. Write the failing regression test first, confirm it fails, then fix.'
        : ''

    const impl = await agent(
        [header, '', firstRound, fixMode, 'Implement this Work Unit, micro-commit per logical step, and pass the Unit Checks.']
            .filter(Boolean).join('\n'),
        { agentType: 'fabrizioduroni-implementer', label: label('implement'), phase: 'Work Units', schema: IMPLEMENT_SCHEMA },
    )
    if (!impl) {
        return { ...record, status: 'failed', note: 'implementer returned nothing' }
    }
    record.commits.push(...impl.commits)
    if (impl.status === 'blocked') {
        return { ...record, status: 'blocked', blockers: impl.blockers }
    }
    if (A.units.length === 1) {
        return { ...record, note: 'single Work Unit: the Integration Review is its review' }
    }

    const range = `${impl.baseSha}...${isolated ? branchOf(unit) : 'HEAD'}`
    let checks = { unitChecks: impl.unitChecks, output: impl.checksOutput, summary: impl.summary, uncertainties: impl.uncertainties || [] }
    let rebuttals = []
    let extraRound = false

    for (let round = 1; ; round++) {
        record.rounds = round
        const review = await agent(
            [
                header,
                '',
                `Unit Review of ${unit.id}, round ${round}. Diff range: ${range}` +
                    (isolated ? ` (read files under ${worktreeOf(unit)} with absolute paths).` : '.'),
                `Implementer's summary: ${checks.summary}`,
                checks.uncertainties.length ? `Implementer's uncertainties: ${checks.uncertainties.join('; ')}` : '',
                `Unit Checks as reported: ${JSON.stringify(checks.unitChecks)}\n${checks.output}`,
                rebuttals.length
                    ? `The implementer rebutted these findings; decide withdraw or reassert for each:\n` +
                      rebuttals.map((r) => `${r.id}: ${r.note}`).join('\n')
                    : '',
            ].filter(Boolean).join('\n'),
            { agentType: 'fabrizioduroni-code-reviewer', label: label(`review-r${round}`), phase: 'Work Units', schema: REVIEW_SCHEMA },
        )
        if (!review) {
            return { ...record, status: 'failed', note: 'reviewer returned nothing' }
        }
        record.nonBlocking = review.nonBlocking
        const open = reviewOpen(review, rebuttals.map((r) => r.id))
        record.blocking = open.blocking

        const decision = resolutions[unit.id]
        if (open.reasserted.length && !(decision && decision.action === 'continue' && !extraRound)) {
            if (decision && decision.action === 'accept') {
                return { ...record, status: 'converged', acceptedByHuman: decision.note }
            }
            return { ...record, status: 'escalated', escalation: { findings: open.blocking, rebuttals, reviewer: open.reasserted } }
        }
        if (!open.blocking.length) {
            return record
        }
        if (round >= maxUnitRounds && !(decision && decision.action === 'continue' && !extraRound)) {
            if (decision && decision.action === 'accept') {
                return { ...record, status: 'converged', acceptedByHuman: decision.note }
            }
            return { ...record, status: 'exhausted' }
        }
        if (round >= maxUnitRounds || open.reasserted.length) {
            extraRound = true
        }

        const fix = await agent(
            [
                header,
                '',
                `Fix round after Unit Review round ${round}.` +
                    (isolated ? ` Your worktree already exists at ${worktreeOf(unit)}: cd into it and work there.` : ''),
                extraRound && decision ? `Fabrizio's decision on the open findings: ${decision.note}` : '',
                'Resolve each blocking finding by id as fixed (and re-run the Unit Checks) or rebutted (written ' +
                    'technical justification; you may rebut a finding only once):',
                listFindings(open.blocking),
            ].filter(Boolean).join('\n'),
            { agentType: 'fabrizioduroni-implementer', label: label(`fix-r${round}`), phase: 'Work Units', schema: FIX_SCHEMA },
        )
        if (!fix) {
            return { ...record, status: 'failed', note: 'implementer returned nothing on a fix round' }
        }
        record.commits.push(...fix.commits)
        if (fix.status === 'blocked') {
            return { ...record, status: 'blocked', blockers: fix.blockers }
        }
        rebuttals = fix.resolutions.filter((r) => r.outcome === 'rebutted')
        checks = { unitChecks: fix.unitChecks, output: fix.checksOutput, summary: `fix round ${round}`, uncertainties: [] }
    }
}

async function mergeWave(wave, results) {
    const ready = wave.filter((u) => results[u.id].status === 'converged')
    if (!ready.length) {
        return
    }
    const merge = await agent(
        [
            context,
            '',
            `In ${A.repoRoot}, on ${A.featureBranch}, merge these Work Unit branches one at a time, in this order, with ` +
                '`git merge --no-ff <branch> -m "chore(ai): :twisted_rightwards_arrows: merge <id> <title>"`:',
            ready.map((u) => `- ${u.id} (${u.title}): ${branchOf(u)}, worktree ${worktreeOf(u)}`).join('\n'),
            '',
            'Each Work Unit owns its files, so conflicts should not happen. Resolve a conflict ONLY when it is trivial: ' +
                'both sides add separate, independent entries (e.g. two new lines in a list or a barrel). Anything else: ' +
                '`git merge --abort`, report it as a conflict, and carry on with the next branch.',
            'After each successful merge: `git worktree remove --force <worktree>` then `git branch -d <branch>`. ' +
                'Leave the worktree and branch of a conflicted Work Unit in place for inspection.',
            'If any merged branch changed a package.json or package-lock.json, run `npm install` in the repository afterwards.',
            'A branch that no longer exists and whose commits are already on the feature branch was merged by an ' +
                'earlier run of this workflow: report it as merged.',
            'Never push, never rebase, never touch main.',
        ].join('\n'),
        { label: `merge:${ready.map((u) => u.id).join('+')}`, phase: 'Merge', model: 'sonnet', schema: MERGE_SCHEMA },
    )
    if (!merge) {
        ready.forEach((u) => {
            results[u.id] = { ...results[u.id], status: 'merge-conflict', note: 'merge agent returned nothing' }
        })
        return
    }
    merge.conflicts.forEach((c) => {
        results[c.id] = { ...results[c.id], status: 'merge-conflict', conflict: c }
    })
}

async function integrate(anyUi) {
    const record = { status: 'converged', rounds: 0, checks: null, sentinel: null, blocking: [], nonBlocking: [] }
    let rebuttals = []
    let extraRound = false
    const decision = resolutions.integration

    for (let round = 1; ; round++) {
        record.rounds = round
        const gate = await agent(
            [
                context,
                '',
                `Integration round ${round}: run the Full Checks in ${A.repoRoot} on ${A.featureBranch} against base ` +
                    `${A.baseBranch || 'main'}. The plan ${anyUi ? 'does' : 'does not'} expect UI/route/flow changes; ` +
                    'confirm from the diff and set touchesUi.',
            ].join('\n'),
            { agentType: 'fabrizioduroni-gate-runner', label: `full-checks-r${round}`, phase: 'Integration', schema: GATE_SCHEMA },
        )
        if (!gate) {
            return { ...record, status: 'failed', note: 'gate-runner returned nothing' }
        }
        record.checks = gate
        if (gate.verdict === 'ENVIRONMENT') {
            return { ...record, status: 'environment' }
        }

        const [review, sentinel] = await parallel([
            () => agent(
                [
                    context,
                    '',
                    `Integration Review, round ${round}. Diff range: ${A.baseBranch || 'main'}...${A.featureBranch}. ` +
                        'All Work Units are merged; judge the seams between them and the whole against the Approved Plan.',
                    `Full Checks (from fabrizioduroni-gate-runner): ${gate.verdict} ${JSON.stringify(gate.checks)}`,
                    gate.failures ? `Failures:\n${gate.failures}` : '',
                    rebuttals.length
                        ? `The implementer rebutted these findings; decide withdraw or reassert for each:\n` +
                          rebuttals.map((r) => `${r.id}: ${r.note}`).join('\n')
                        : '',
                ].filter(Boolean).join('\n'),
                { agentType: 'fabrizioduroni-code-reviewer', label: `integration-review-r${round}`, phase: 'Integration', schema: REVIEW_SCHEMA },
            ),
            () => gate.touchesUi
                ? agent(
                    [
                        context,
                        '',
                        `Live QA of the combined change, round ${round}, in ${A.repoRoot}. The changed flows and URLs are ` +
                            'in the Approved Plan; derive anything missing from the diff against the base branch. ' +
                            'Give each blocking finding an id S1, S2, ….',
                    ].join('\n'),
                    { agentType: 'fabrizioduroni-e2e-sentinel', label: `live-qa-r${round}`, phase: 'Integration', schema: SENTINEL_SCHEMA },
                )
                : Promise.resolve(null),
        ])
        if (!review) {
            return { ...record, status: 'failed', note: 'Integration Review returned nothing' }
        }
        record.sentinel = sentinel
        const open = reviewOpen(review, rebuttals.map((r) => r.id))
        const blocking = open.blocking.concat(sentinel ? sentinel.blocking : [])
        record.blocking = blocking
        record.nonBlocking = review.nonBlocking.concat(sentinel ? sentinel.nonBlocking : [])

        if (open.reasserted.length && !(decision && decision.action === 'continue' && !extraRound)) {
            if (decision && decision.action === 'accept') {
                return { ...record, status: 'converged', acceptedByHuman: decision.note }
            }
            return { ...record, status: 'escalated', escalation: { findings: blocking, rebuttals, reviewer: open.reasserted } }
        }
        if (gate.verdict === 'GREEN' && !blocking.length) {
            return record
        }
        if (round >= maxIntegrationRounds && !(decision && decision.action === 'continue' && !extraRound)) {
            if (decision && decision.action === 'accept') {
                return { ...record, status: 'converged', acceptedByHuman: decision.note }
            }
            return { ...record, status: 'exhausted' }
        }
        if (round >= maxIntegrationRounds || open.reasserted.length) {
            extraRound = true
        }

        const fix = await agent(
            [
                context,
                '',
                `Integration fix round ${round}, in the shared tree at ${A.repoRoot} on ${A.featureBranch}.`,
                extraRound && decision ? `Fabrizio's decision on the open findings: ${decision.note}` : '',
                gate.verdict === 'RED' ? `Full Checks were RED (gate-runner):\n${gate.failures}` : '',
                blocking.length
                    ? 'Resolve each blocking finding by id as fixed or rebutted (once, with written justification):\n' +
                      listFindings(blocking)
                    : '',
                'Then re-run the Unit Checks plus whichever specific check was red.',
            ].filter(Boolean).join('\n'),
            { agentType: 'fabrizioduroni-implementer', label: `integration-fix-r${round}`, phase: 'Integration', schema: FIX_SCHEMA },
        )
        if (!fix) {
            return { ...record, status: 'failed', note: 'implementer returned nothing on an integration fix round' }
        }
        if (fix.status === 'blocked') {
            return { ...record, status: 'blocked', blockers: fix.blockers }
        }
        rebuttals = fix.resolutions.filter((r) => r.outcome === 'rebutted')
    }
}

const plan = waves(A.units)
log(`Work Unit Graph: ${plan.map((w, i) => `Wave ${i + 1} [${w.map((u) => u.id).join(', ')}]`).join(' → ')}`)

const results = {}
for (let i = 0; i < plan.length; i++) {
    const wave = plan[i]
    const isolated = wave.length > 1
    const runnable = []
    wave.forEach((u) => {
        const stuck = (u.dependsOn || []).filter((d) => results[d].status !== 'converged')
        if (stuck.length) {
            results[u.id] = { id: u.id, title: u.title, status: 'skipped', note: `depends on stuck ${stuck.join(', ')}` }
        } else {
            runnable.push(u)
        }
    })
    if (runnable.length < wave.length) {
        log(`Wave ${i + 1}: skipping ${wave.length - runnable.length} Work Unit(s) whose dependencies are stuck`)
    }
    const outcomes = await parallel(runnable.map((u) => () => runUnit(u, isolated)))
    runnable.forEach((u, k) => {
        results[u.id] = outcomes[k] || { id: u.id, title: u.title, status: 'failed', note: 'Work Unit run threw' }
    })
    if (isolated) {
        await mergeWave(runnable, results)
    }
}

const units = A.units.map((u) => results[u.id])
const stuck = units.filter((u) => u.status !== 'converged')
if (stuck.length) {
    log(`Not integrating: ${stuck.map((u) => `${u.id} ${u.status}`).join(', ')}`)
    return { status: 'partial', units, integration: null }
}

const integration = await integrate(A.units.some((u) => u.touchesUi))
return { status: integration.status, units, integration }
