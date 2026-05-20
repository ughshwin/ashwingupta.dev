import json
from pathlib import Path

import networkx as nx

INPUT = Path("data/recommendations_enriched.json")
OUTPUT = Path("data/graph.json")
CENTRAL_PERSON = "Ashwin Gupta"


def build_graph() -> None:
    recs = json.loads(INPUT.read_text(encoding="utf-8"))

    graph = nx.Graph()
    graph.add_node(CENTRAL_PERSON, type="person")

    for rec in recs:
        person = rec.get("name", "Unknown")
        graph.add_node(person, type="person")
        graph.add_edge(person, CENTRAL_PERSON, relation="recommended")

        for skill in rec.get("skills", []):
            graph.add_node(skill, type="skill")
            graph.add_edge(CENTRAL_PERSON, skill, relation="skill")

    graph_data = nx.node_link_data(graph)
    OUTPUT.write_text(json.dumps(graph_data, indent=2, ensure_ascii=False), encoding="utf-8")
    print(
        f"Wrote graph with {graph.number_of_nodes()} nodes and {graph.number_of_edges()} edges to {OUTPUT}"
    )


if __name__ == "__main__":
    build_graph()
