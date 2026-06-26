"use client";

import { FC } from "react";
import {
    RedPillButton,
    BluePillButton,
} from "@/components/design-system/molecules/buttons/pills-buttons";
import { useGraphPropertiesVisualizerStore } from "./use-graph-properties-visualizer-store";

interface GraphNode {
    id: string;
    x: number;
    y: number;
}

interface GraphEdge {
    from: string;
    to: string;
    weight?: number;
}

interface GraphExample {
    label: string;
    description: string;
    nodes: GraphNode[];
    edges: GraphEdge[];
    directed: boolean;
    weighted: boolean;
}

const graphExamples: GraphExample[] = [
    {
        label: "Undirected",
        description: "Edges have no direction. If A connects to B, then B connects to A.",
        nodes: [
            { id: "A", x: 60, y: 40 },
            { id: "B", x: 200, y: 40 },
            { id: "C", x: 130, y: 140 },
            { id: "D", x: 270, y: 140 },
        ],
        edges: [
            { from: "A", to: "B" },
            { from: "A", to: "C" },
            { from: "B", to: "C" },
            { from: "B", to: "D" },
        ],
        directed: false,
        weighted: false,
    },
    {
        label: "Directed",
        description: "Each edge has a direction. An edge from A to B does not imply an edge from B to A.",
        nodes: [
            { id: "A", x: 60, y: 40 },
            { id: "B", x: 200, y: 40 },
            { id: "C", x: 130, y: 140 },
            { id: "D", x: 270, y: 140 },
        ],
        edges: [
            { from: "A", to: "B" },
            { from: "A", to: "C" },
            { from: "C", to: "B" },
            { from: "B", to: "D" },
        ],
        directed: true,
        weighted: false,
    },
    {
        label: "Weighted",
        description: "Each edge carries a numerical weight representing cost, distance, or capacity.",
        nodes: [
            { id: "A", x: 60, y: 40 },
            { id: "B", x: 200, y: 40 },
            { id: "C", x: 130, y: 140 },
            { id: "D", x: 270, y: 140 },
        ],
        edges: [
            { from: "A", to: "B", weight: 4 },
            { from: "A", to: "C", weight: 2 },
            { from: "B", to: "D", weight: 7 },
            { from: "C", to: "D", weight: 3 },
        ],
        directed: false,
        weighted: true,
    },
    {
        label: "Cyclic",
        description: "Contains at least one cycle: a path that starts and ends at the same vertex.",
        nodes: [
            { id: "A", x: 60, y: 40 },
            { id: "B", x: 200, y: 40 },
            { id: "C", x: 200, y: 140 },
            { id: "D", x: 60, y: 140 },
        ],
        edges: [
            { from: "A", to: "B" },
            { from: "B", to: "C" },
            { from: "C", to: "D" },
            { from: "D", to: "A" },
        ],
        directed: true,
        weighted: false,
    },
    {
        label: "DAG",
        description: "A Directed Acyclic Graph has directed edges but no cycles. Admits topological ordering.",
        nodes: [
            { id: "A", x: 60, y: 40 },
            { id: "B", x: 180, y: 40 },
            { id: "C", x: 60, y: 140 },
            { id: "D", x: 180, y: 140 },
            { id: "E", x: 300, y: 90 },
        ],
        edges: [
            { from: "A", to: "B" },
            { from: "A", to: "C" },
            { from: "B", to: "D" },
            { from: "C", to: "D" },
            { from: "D", to: "E" },
        ],
        directed: true,
        weighted: false,
    },
    {
        label: "Disconnected",
        description:
            "Multiple connected components with no edges between them. A single traversal from one node cannot reach all vertices.",
        nodes: [
            { id: "A", x: 50, y: 60 },
            { id: "B", x: 140, y: 60 },
            { id: "C", x: 95, y: 140 },
            { id: "X", x: 230, y: 60 },
            { id: "Y", x: 320, y: 60 },
        ],
        edges: [
            { from: "A", to: "B" },
            { from: "B", to: "C" },
            { from: "A", to: "C" },
            { from: "X", to: "Y" },
        ],
        directed: false,
        weighted: false,
    },
];

const nodeRadius = 18;

const getNode = (nodes: GraphNode[], id: string): GraphNode => nodes.find((n) => n.id === id)!;

const ArrowHead: FC<{ id: string }> = ({ id }) => (
    <defs>
        <marker
            id={id}
            viewBox="0 0 10 10"
            refX="10"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
        >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#22d3ee" />
        </marker>
    </defs>
);

const EdgeLine: FC<{
    edge: GraphEdge;
    nodes: GraphNode[];
    directed: boolean;
    weighted: boolean;
    index: number;
}> = ({ edge, nodes, directed, weighted, index }) => {
    const fromNode = getNode(nodes, edge.from);
    const toNode = getNode(nodes, edge.to);

    const dx = toNode.x - fromNode.x;
    const dy = toNode.y - fromNode.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / dist;
    const uy = dy / dist;

    const startX = fromNode.x + ux * nodeRadius;
    const startY = fromNode.y + uy * nodeRadius;
    const endX = toNode.x - ux * (nodeRadius + (directed ? 6 : 0));
    const endY = toNode.y - uy * (nodeRadius + (directed ? 6 : 0));

    const markerId = `arrow-${index}`;

    return (
        <g>
            {directed && <ArrowHead id={markerId} />}
            <line
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}
                stroke="#22d3ee"
                strokeWidth={2}
                markerEnd={directed ? `url(#${markerId})` : undefined}
            />
            {weighted && edge.weight !== undefined && (
                <text
                    x={(startX + endX) / 2 + uy * 14}
                    y={(startY + endY) / 2 - ux * 14}
                    fill="#fbbf24"
                    fontSize={13}
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="central"
                >
                    {edge.weight}
                </text>
            )}
        </g>
    );
};

const NodeCircle: FC<{ node: GraphNode }> = ({ node }) => (
    <g>
        <circle cx={node.x} cy={node.y} r={nodeRadius} fill="#1e293b" stroke="#22d3ee" strokeWidth={2} />
        <text x={node.x} y={node.y} fill="#ffffff" fontSize={14} fontWeight="bold" textAnchor="middle" dominantBaseline="central">
            {node.id}
        </text>
    </g>
);

export const GraphPropertiesVisualizer: FC = () => {
    const { state, effects } = useGraphPropertiesVisualizerStore(graphExamples.length);
    const { selectedIndex } = state;
    const { goToPrevious, goToNext, selectIndex } = effects;
    const example = graphExamples[selectedIndex];

    return (
        <div className="w-full">
            <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
                {graphExamples.map((ex, i) => (
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
                <svg
                    viewBox="0 0 360 180"
                    className="w-full max-w-md"
                    aria-label={`Graph example: ${example.label}`}
                >
                    {example.edges.map((edge, i) => (
                        <EdgeLine
                            key={`${edge.from}-${edge.to}`}
                            edge={edge}
                            nodes={example.nodes}
                            directed={example.directed}
                            weighted={example.weighted}
                            index={i}
                        />
                    ))}
                    {example.nodes.map((node) => (
                        <NodeCircle key={node.id} node={node} />
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
