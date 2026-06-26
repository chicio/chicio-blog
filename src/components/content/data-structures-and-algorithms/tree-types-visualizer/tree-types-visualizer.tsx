"use client";

import { FC } from "react";
import {
    RedPillButton,
    BluePillButton,
} from "@/components/design-system/molecules/buttons/pills-buttons";
import { useTreeTypesVisualizerStore } from "./use-tree-types-visualizer-store";

interface TreeNodeData {
    id: string;
    x: number;
    y: number;
    label?: string;
}

interface TreeEdgeData {
    from: string;
    to: string;
}

interface TreeExample {
    label: string;
    description: string;
    nodes: TreeNodeData[];
    edges: TreeEdgeData[];
}

const treeExamples: TreeExample[] = [
    {
        label: "Full Binary Tree",
        description: "Every node has either zero or two children. No node has exactly one child.",
        nodes: [
            { id: "A", x: 180, y: 30 },
            { id: "B", x: 100, y: 90 },
            { id: "C", x: 260, y: 90 },
            { id: "D", x: 60, y: 150 },
            { id: "E", x: 140, y: 150 },
            { id: "F", x: 220, y: 150 },
            { id: "G", x: 300, y: 150 },
        ],
        edges: [
            { from: "A", to: "B" },
            { from: "A", to: "C" },
            { from: "B", to: "D" },
            { from: "B", to: "E" },
            { from: "C", to: "F" },
            { from: "C", to: "G" },
        ],
    },
    {
        label: "Complete Binary Tree",
        description: "Every level is fully filled except possibly the last, which is filled from left to right.",
        nodes: [
            { id: "A", x: 180, y: 30 },
            { id: "B", x: 100, y: 90 },
            { id: "C", x: 260, y: 90 },
            { id: "D", x: 60, y: 150 },
            { id: "E", x: 140, y: 150 },
            { id: "F", x: 220, y: 150 },
        ],
        edges: [
            { from: "A", to: "B" },
            { from: "A", to: "C" },
            { from: "B", to: "D" },
            { from: "B", to: "E" },
            { from: "C", to: "F" },
        ],
    },
    {
        label: "Perfect Binary Tree",
        description: "Every internal node has exactly two children and all leaves are at the same depth.",
        nodes: [
            { id: "A", x: 180, y: 20 },
            { id: "B", x: 100, y: 70 },
            { id: "C", x: 260, y: 70 },
            { id: "D", x: 60, y: 130 },
            { id: "E", x: 140, y: 130 },
            { id: "F", x: 220, y: 130 },
            { id: "G", x: 300, y: 130 },
            { id: "H", x: 40, y: 180 },
            { id: "I", x: 80, y: 180 },
            { id: "J", x: 120, y: 180 },
            { id: "K", x: 160, y: 180 },
            { id: "L", x: 200, y: 180 },
            { id: "M", x: 240, y: 180 },
            { id: "N", x: 280, y: 180 },
            { id: "O", x: 320, y: 180 },
        ],
        edges: [
            { from: "A", to: "B" },
            { from: "A", to: "C" },
            { from: "B", to: "D" },
            { from: "B", to: "E" },
            { from: "C", to: "F" },
            { from: "C", to: "G" },
            { from: "D", to: "H" },
            { from: "D", to: "I" },
            { from: "E", to: "J" },
            { from: "E", to: "K" },
            { from: "F", to: "L" },
            { from: "F", to: "M" },
            { from: "G", to: "N" },
            { from: "G", to: "O" },
        ],
    },
    {
        label: "Balanced Binary Tree",
        description: "For every node, the heights of its left and right subtrees differ by at most one.",
        nodes: [
            { id: "A", x: 180, y: 30 },
            { id: "B", x: 100, y: 90 },
            { id: "C", x: 260, y: 90 },
            { id: "D", x: 60, y: 150 },
            { id: "E", x: 140, y: 150 },
            { id: "F", x: 300, y: 150 },
        ],
        edges: [
            { from: "A", to: "B" },
            { from: "A", to: "C" },
            { from: "B", to: "D" },
            { from: "B", to: "E" },
            { from: "C", to: "F" },
        ],
    },
    {
        label: "Degenerate (Skewed)",
        description: "Every internal node has exactly one child. The tree degenerates into a linked list.",
        nodes: [
            { id: "A", x: 120, y: 20 },
            { id: "B", x: 160, y: 60 },
            { id: "C", x: 200, y: 100 },
            { id: "D", x: 240, y: 140 },
            { id: "E", x: 280, y: 180 },
        ],
        edges: [
            { from: "A", to: "B" },
            { from: "B", to: "C" },
            { from: "C", to: "D" },
            { from: "D", to: "E" },
        ],
    },
    {
        label: "N-ary Tree",
        description: "Each node may have any number of children, not limited to two.",
        nodes: [
            { id: "A", x: 180, y: 25 },
            { id: "B", x: 60, y: 90 },
            { id: "C", x: 180, y: 90 },
            { id: "D", x: 300, y: 90 },
            { id: "E", x: 20, y: 160 },
            { id: "F", x: 60, y: 160 },
            { id: "G", x: 100, y: 160 },
            { id: "H", x: 160, y: 160 },
            { id: "I", x: 200, y: 160 },
        ],
        edges: [
            { from: "A", to: "B" },
            { from: "A", to: "C" },
            { from: "A", to: "D" },
            { from: "B", to: "E" },
            { from: "B", to: "F" },
            { from: "B", to: "G" },
            { from: "C", to: "H" },
            { from: "C", to: "I" },
        ],
    },
];

const nodeRadius = 14;

const getNode = (nodes: TreeNodeData[], id: string): TreeNodeData => nodes.find((n) => n.id === id)!;

const TreeEdgeLine: FC<{
    edge: TreeEdgeData;
    nodes: TreeNodeData[];
}> = ({ edge, nodes }) => {
    const fromNode = getNode(nodes, edge.from);
    const toNode = getNode(nodes, edge.to);

    const dx = toNode.x - fromNode.x;
    const dy = toNode.y - fromNode.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / dist;
    const uy = dy / dist;

    const startX = fromNode.x + ux * nodeRadius;
    const startY = fromNode.y + uy * nodeRadius;
    const endX = toNode.x - ux * nodeRadius;
    const endY = toNode.y - uy * nodeRadius;

    return <line x1={startX} y1={startY} x2={endX} y2={endY} stroke="#22d3ee" strokeWidth={2} />;
};

const TreeNodeCircle: FC<{ node: TreeNodeData }> = ({ node }) => (
    <g>
        <circle cx={node.x} cy={node.y} r={nodeRadius} fill="#1e293b" stroke="#22d3ee" strokeWidth={2} />
        <text
            x={node.x}
            y={node.y}
            fill="#ffffff"
            fontSize={12}
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="central"
        >
            {node.label ?? node.id}
        </text>
    </g>
);

export const TreeTypesVisualizer: FC = () => {
    const { state, effects } = useTreeTypesVisualizerStore();
    const { selectedIndex } = state;
    const { goToPrevious, goToNext, selectIndex } = effects;
    const example = treeExamples[selectedIndex];

    return (
        <div className="w-full">
            <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
                {treeExamples.map((ex, i) => (
                    <button
                        key={ex.label}
                        onClick={selectIndex(i)}
                        className={`rounded-lg border px-3 py-1 text-sm font-mono transition-colors ${
                            i === selectedIndex
                                ? "border-accent bg-primary-dark text-accent"
                                : "border-gray-600 bg-transparent text-gray-400 hover:border-accent hover:text-accent"
                        }`}
                    >
                        {ex.label}
                    </button>
                ))}
            </div>

            <div className="flex justify-center">
                <svg viewBox="0 0 360 200" className="w-full max-w-md" aria-label={`Tree example: ${example.label}`}>
                    {example.edges.map((edge) => (
                        <TreeEdgeLine
                            key={`${edge.from}-${edge.to}`}
                            edge={edge}
                            nodes={example.nodes}
                        />
                    ))}
                    {example.nodes.map((node) => (
                        <TreeNodeCircle key={node.id} node={node} />
                    ))}
                </svg>
            </div>

            <p className="mt-3 text-center text-sm text-gray-300">
                <span className="font-bold text-accent">{example.label}</span>
                {" — "}
                {example.description}
            </p>

            <div className="mt-4 flex justify-center gap-3">
                <BluePillButton onClick={goToPrevious}>Previous</BluePillButton>
                <RedPillButton onClick={goToNext}>Next</RedPillButton>
            </div>
        </div>
    );
};
