"""
CAPER Weighted Scorer & Ranking System
========================================
Aggregates five-dimension scores into a composite score,
assigns grades (S/A/B/C/D), and generates rankings.
"""

from __future__ import annotations
from dataclasses import dataclass, field
from typing import Any


@dataclass
class AgentScoreCard:
    """Complete evaluation scorecard for one agent."""
    agent_id: str
    agent_name: str
    vendor: str
    category: str
    dimensions: dict[str, float]     # dimension -> score (0-100)
    sub_scores: dict[str, dict]      # dimension -> sub_scores dict
    composite_score: float = 0.0
    grade: str = ""
    rank: int = 0


class CAPERScorer:
    """Aggregates CAPER dimension scores and produces rankings."""

    DEFAULT_WEIGHTS = {
        "knowledge": 0.25,
        "task_completion": 0.25,
        "cost_performance": 0.20,
        "interaction": 0.15,
        "safety": 0.15,
    }

    GRADE_THRESHOLDS = [
        (90, "S"),
        (80, "A"),
        (70, "B"),
        (60, "C"),
        (0,  "D"),
    ]

    def __init__(self, weights: dict[str, float] | None = None):
        self.weights = weights or self.DEFAULT_WEIGHTS

    def compute_composite(self, dimensions: dict[str, float]) -> float:
        """Compute weighted composite score."""
        total = 0.0
        for dim, weight in self.weights.items():
            total += dimensions.get(dim, 0.0) * weight
        return round(total, 2)

    def assign_grade(self, score: float) -> str:
        """Assign letter grade based on score."""
        for threshold, grade in self.GRADE_THRESHOLDS:
            if score >= threshold:
                return grade
        return "D"

    def score_agent(self, agent_id: str, agent_name: str, vendor: str,
                    category: str, dimensions: dict[str, float],
                    sub_scores: dict[str, dict] | None = None) -> AgentScoreCard:
        """Create a complete scorecard for one agent."""
        composite = self.compute_composite(dimensions)
        grade = self.assign_grade(composite)
        return AgentScoreCard(
            agent_id=agent_id,
            agent_name=agent_name,
            vendor=vendor,
            category=category,
            dimensions=dimensions,
            sub_scores=sub_scores or {},
            composite_score=composite,
            grade=grade,
        )

    def rank_agents(self, scorecards: list[AgentScoreCard]) -> list[AgentScoreCard]:
        """Sort agents by composite score and assign ranks."""
        sorted_cards = sorted(scorecards, key=lambda c: c.composite_score, reverse=True)
        for i, card in enumerate(sorted_cards, 1):
            card.rank = i
        return sorted_cards

    def rank_by_dimension(self, scorecards: list[AgentScoreCard],
                          dimension: str) -> list[AgentScoreCard]:
        """Rank agents by a specific dimension score."""
        sorted_cards = sorted(
            scorecards,
            key=lambda c: c.dimensions.get(dimension, 0),
            reverse=True,
        )
        for i, card in enumerate(sorted_cards, 1):
            card.rank = i
        return sorted_cards

    def rank_by_category(self, scorecards: list[AgentScoreCard],
                         category: str) -> list[AgentScoreCard]:
        """Rank agents within a specific category."""
        filtered = [c for c in scorecards if c.category == category]
        return self.rank_agents(filtered)

    def generate_leaderboard(self, scorecards: list[AgentScoreCard]) -> dict[str, Any]:
        """Generate a complete leaderboard data structure."""
        ranked = self.rank_agents(scorecards)

        categories = {}
        for card in ranked:
            cat = card.category
            if cat not in categories:
                categories[cat] = []
            categories[cat].append(card)

        # Re-rank within categories
        for cat in categories:
            for i, card in enumerate(categories[cat], 1):
                pass  # category rank handled at display layer

        return {
            "metadata": {
                "total_agents": len(ranked),
                "evaluation_date": "2026-04",
                "version": "2026 Q2",
                "weights": self.weights,
            },
            "overall_ranking": [self._card_to_dict(c) for c in ranked],
            "category_rankings": {
                cat: [self._card_to_dict(c) for c in cards]
                for cat, cards in categories.items()
            },
            "dimension_rankings": {
                dim: [
                    self._card_to_dict(c)
                    for c in self.rank_by_dimension(scorecards, dim)
                ]
                for dim in self.weights.keys()
            },
        }

    @staticmethod
    def _card_to_dict(card: AgentScoreCard) -> dict:
        return {
            "rank": card.rank,
            "agent_id": card.agent_id,
            "agent_name": card.agent_name,
            "vendor": card.vendor,
            "category": card.category,
            "composite_score": card.composite_score,
            "grade": card.grade,
            "dimensions": card.dimensions,
            "sub_scores": card.sub_scores,
        }
