"""Check or refresh existing Claude mirrors from repository-owned Convex skills."""
from pathlib import Path
import argparse
import sys

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--apply", action="store_true", help="Refresh mirrored files; default only checks")
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    source = root / ".agents" / "skills"
    target = root / ".claude" / "skills"
    pairs = [(source / "CONVEX-WORKFLOWS.md", target / "CONVEX-WORKFLOWS.md")]
    for mirror in sorted(target.glob("convex*/SKILL.md")):
        original = source / mirror.parent.name / "SKILL.md"
        pairs.append((original, mirror))
        original_policy = original.parent / "agents" / "openai.yaml"
        if original_policy.exists():
            pairs.append((original_policy, mirror.parent / "agents" / "openai.yaml"))
    missing = [str(a) for a, _ in pairs if not a.is_file()]
    if missing:
        raise SystemExit("Missing source files: " + ", ".join(missing))
    mismatches = [(a, b) for a, b in pairs if not b.exists() or a.read_bytes() != b.read_bytes()]
    for original, mirror in mismatches:
        if args.apply:
            mirror.parent.mkdir(parents=True, exist_ok=True)
            mirror.write_bytes(original.read_bytes())
        print(("Updated " if args.apply else "Differs: ") + str(mirror.relative_to(root)))
    print(f"Checked {len(pairs)} mirrored files; {len(mismatches)} differences.")
    return 0 if args.apply or not mismatches else 1

if __name__ == "__main__":
    sys.exit(main())
