import json
import re
from pathlib import Path

from skill_keywords import AI_INFRA_SKILLS

INPUT = Path("data/recommendations.json")
OUTPUT = Path("data/recommendations_enriched.json")

# Maps domain language variants to canonical skills.
SKILL_ALIASES: dict[str, str] = {
    "generative ai": "production ai",
    "genai": "production ai",
    "infra setup": "cloud infrastructure",
    "infrastructure setup": "cloud infrastructure",
    "scalability": "scalable systems",
    "scalable": "scalable systems",
    "debugging": "monitoring",
    "real-time": "real time inference",
    "real time": "real time inference",
    "telephony": "inference systems",
    "voip": "inference systems",
    "sip": "inference systems",
    "pjsip": "inference systems",
    "speech-to-text": "inference systems",
    "speech to text": "inference systems",
    "nlp": "inference systems",
    "sentiment-analysis": "inference systems",
    "sentiment analysis": "inference systems",
    "automation": "pipeline automation",
    "testing": "observability",
    "latency": "latency optimization",
}


def extract_skills(text: str) -> list[str]:
    lower_text = text.lower()
    matches: set[str] = set()

    def has_phrase(phrase: str) -> bool:
        pattern = rf"(?<![a-z0-9]){re.escape(phrase)}(?![a-z0-9])"
        return re.search(pattern, lower_text) is not None

    for skill in AI_INFRA_SKILLS:
        if has_phrase(skill):
            matches.add(skill)

    for alias, canonical in SKILL_ALIASES.items():
        if has_phrase(alias):
            matches.add(canonical)

    return sorted(matches)


def get_recommendation_text(rec: dict) -> str:
    # Supports both existing schema (`recommendation`) and the proposed schema (`text`).
    return str(rec.get("text") or rec.get("recommendation") or "")


def main() -> None:
    recs = json.loads(INPUT.read_text(encoding="utf-8"))

    enriched = []
    for rec in recs:
        text = get_recommendation_text(rec)
        enriched.append(
            {
                "name": rec.get("name", "Unknown"),
                "text": text,
                "skills": extract_skills(text),
            }
        )

    OUTPUT.write_text(json.dumps(enriched, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Wrote {len(enriched)} records to {OUTPUT}")


if __name__ == "__main__":
    main()
