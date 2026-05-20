import json
from collections import Counter
from pathlib import Path

INPUT = Path("data/recommendations_enriched.json")


def main() -> None:
    recs = json.loads(INPUT.read_text(encoding="utf-8"))

    counter = Counter()
    for rec in recs:
        counter.update(rec.get("skills", []))

    if not counter:
        print("No skill matches found in recommendations_enriched.json")
        return

    max_count = max(counter.values())
    scale = 12

    print("Skill Frequency")
    print("----------------")
    for skill, count in counter.most_common():
        bar_len = max(1, int((count / max_count) * scale))
        print(f"{skill:<30} {'█' * bar_len} ({count})")


if __name__ == "__main__":
    main()
