#!/usr/bin/env python3
"""Cross-link orphan concept pages into the knowledge graph.

For each orphan concept, add a wikilink from the most relevant hub page's
Related section. This makes orphan pages discoverable by wiki-context-pack
and wiki-query skills.
"""
import os, re

# Map: orphan concept stem -> list of hub files to add link into
ORPHAN_LINKS = {
    # K8s RBAC → Core Components Deep Dive
    "clusterrole":        ["12_Architecture_Infrastructure/Kubernetes_Core_Components_Deep_Dive.md"],
    "clusterrolebinding": ["12_Architecture_Infrastructure/Kubernetes_Core_Components_Deep_Dive.md"],
    "role":               ["12_Architecture_Infrastructure/Kubernetes_Core_Components_Deep_Dive.md"],
    "rolebinding":        ["12_Architecture_Infrastructure/Kubernetes_Core_Components_Deep_Dive.md"],

    # K8s resource model → Core Components
    "label":              ["12_Architecture_Infrastructure/Kubernetes_Core_Components_Deep_Dive.md"],
    "annotation":         ["12_Architecture_Infrastructure/Kubernetes_Core_Components_Deep_Dive.md"],
    "selector":           ["12_Architecture_Infrastructure/Kubernetes_Core_Components_Deep_Dive.md"],

    # K8s workload controllers → Core Components
    "daemonset":          ["12_Architecture_Infrastructure/Kubernetes_Core_Components_Deep_Dive.md"],
    "vertical-pod-autoscaler": ["12_Architecture_Infrastructure/Kubernetes_Core_Components_Deep_Dive.md"],

    # K8s security
    "pod-security-standards": ["12_Architecture_Infrastructure/Kubernetes_Core_Components_Deep_Dive.md"],
    "trivy":              ["12_Architecture_Infrastructure/Kubernetes_Core_Components_Deep_Dive.md"],

    # K8s storage (already linked from synthesis but ensure hub coverage)
    "storageclass":       ["12_Architecture_Infrastructure/Kubernetes_Storage_Deep_Dive.md"],
    "persistent-volume":  ["12_Architecture_Infrastructure/Kubernetes_Storage_Deep_Dive.md"],

    # K8s networking
    "network-policy":     ["12_Architecture_Infrastructure/Kubernetes_Networking_Deep_Dive.md"],

    # CI/CD / GitOps
    "tekton":             ["11_MLOps_Pipeline/CI_CD/CI_CD_Pipeline_AI_2026.md"],
    "argo-rollouts":      ["11_MLOps_Pipeline/CI_CD/CI_CD_Pipeline_AI_2026.md"],

    # AI/LLM concepts → MLOps pages
    "llmops":             ["11_MLOps_Pipeline/LLMOps_2026.md"],
    "token-plain":        ["05_NLP_LLMs/LLM_For_Beginners.md"],
    "model-weights-plain": ["10_Deployment_Inference/Model_Hot_Reload_and_Rollback_Runbook.md"],

    # Math (lower priority but still link)
    "matrix-operations":  ["01_Fundamentals/Linear_Algebra/README.md"],
}

def add_link_to_file(filepath, concept_stem):
    """Add a wikilink to concept_stem in the file's Related section."""
    if not os.path.exists(filepath):
        return False, "file not found"
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    wikilink = f"- [[{concept_stem}]]"
    # Check if already linked
    if f'[[{concept_stem}]]' in content:
        return False, "already linked"

    # Find the Related section
    related_match = re.search(r'^## Related\s*$', content, re.MULTILINE)
    if related_match:
        # Find the end of the Related section (next ## or end of file)
        start = related_match.end()
        next_section = re.search(r'^## ', content[start:], re.MULTILINE)
        if next_section:
            insert_pos = start + next_section.start()
        else:
            insert_pos = len(content)
        # Insert before the next section, add newline if needed
        insert_text = f"\n{wikilink}\n"
        content = content[:insert_pos].rstrip('\n') + '\n' + wikilink + '\n' + content[insert_pos:].lstrip('\n')
    else:
        # No Related section, add one at the end
        content = content.rstrip('\n') + f"\n\n## Related\n\n{wikilink}\n"

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    return True, "linked"

def main():
    total_linked = 0
    total_skipped = 0
    for orphan, hubs in ORPHAN_LINKS.items():
        for hub in hubs:
            ok, msg = add_link_to_file(hub, orphan)
            if ok:
                print(f"  LINKED: [[{orphan}]] -> {hub}")
                total_linked += 1
            else:
                total_skipped += 1
    print(f"\nDone: {total_linked} links added, {total_skipped} skipped")

if __name__ == '__main__':
    main()
