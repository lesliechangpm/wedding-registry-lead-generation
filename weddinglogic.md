# Wedding Budget to Mortgage Lead Logic

## Overview
This document explains the statistical and economic logic used to derive estimated income and target home purchase prices from wedding registry data.

## Core Logic Framework

### 1. Wedding Budget to Income Correlation
**Key Assumption**: Wedding budgets typically represent 15-35% of a couple's annual household income.

```
Estimated Income = Wedding Budget ÷ Budget-to-Income Ratio
Where Budget-to-Income Ratio = 0.15 to 0.35 (15% to 35%)
```

**Statistical Basis**:
- Wedding industry data shows couples spend 15-35% of annual income on weddings
- Higher-income couples tend toward the lower percentage (15-20%)
- Middle-income couples trend toward higher percentages (25-35%)

**Example**:
- Elizabeth & Mark: Wedding Budget = $38,254
- Budget-to-Income Ratio = 17.1% (randomly selected within range)
- Estimated Income = $38,254 ÷ 0.171 = $223,712

### 2. Income to Home Purchase Price
**Key Assumption**: Home buyers typically purchase homes valued at 2.5-4.0x their annual household income.

```
Target Purchase Price = Estimated Income × Income Multiplier
Where Income Multiplier = 2.5 to 4.0
```

**Economic Basis**:
- Traditional mortgage lending guidelines suggest 2.5-3x income for conservative buyers
- Contemporary markets and dual-income households support up to 4x income
- Debt-to-income ratios and credit scores influence the multiplier

**Example**:
- Elizabeth & Mark: Estimated Income = $223,712
- Income Multiplier = 2.68x (randomly selected within range)
- Target Purchase Price = $223,712 × 2.68 = $599,548 (rounded to $600,000)

### 3. Geographic Adjustments
Wedding budgets vary significantly by location due to cost-of-living differences:

**Base Budget Tiers**:
- **High-Cost Markets** (CA, NY, MA, CT, NJ): $45,000 base
- **Medium-Cost Markets** (TX, FL, IL, WA): $35,000 base
- **Standard Markets** (All others): $25,000 base

**Variation**: Each couple's budget = Base Budget × Random Factor (0.7 to 1.5)

This accounts for:
- Regional cost differences
- Venue availability and pricing
- Local wedding industry competition

### 4. Lead Scoring Algorithm (100-Point Scale)

**Wedding Budget Factor** (10-25 points):
- $50,000+: 25 points
- $35,000-$49,999: 20 points
- $25,000-$34,999: 15 points
- Under $25,000: 10 points

**Purchase Timeline Factor** (5-20 points):
- 3 months: 20 points
- 6 months: 15 points
- 12 months: 10 points
- 18+ months: 5 points

**Credit Score Factor** (3-15 points):
- Excellent: 15 points
- Very Good: 12 points
- Good: 8 points
- Fair: 3 points

**Income Factor** (3-15 points):
- $150,000+: 15 points
- $100,000-$149,999: 12 points
- $75,000-$99,999: 8 points
- Under $75,000: 3 points

**Wedding Stage Factor** (5-15 points):
- Recently Married: 15 points (prime buying time)
- Planning: 10 points (future potential)
- Engaged: 5 points (early stage)

### 5. Real-World Validation

**Industry Research Support**:
- The Knot 2023 Wedding Study: Average wedding cost $35,000
- Federal Reserve: Median household income $70,000
- NAR: First-time buyers typically 28-32 years old (prime wedding age)
- Mortgage industry: 69% of married couples buy homes within 2 years

**Risk Factors Considered**:
- Student loan debt (affects DTI ratios)
- Wedding debt (temporary income reduction)
- Career stage (income growth potential)
- Regional market conditions

### 6. Business Application

**Lead Quality Metrics**:
- **High-Value Leads**: Score 80+ (wedding budget $40,000+, excellent credit, 3-6 month timeline)
- **Prime Leads**: Score 60-79 (solid income, good credit, realistic timeline)
- **Nurture Leads**: Score 40-59 (potential with proper cultivation)
- **Long-term Leads**: Score under 40 (early stage, requires patience)

**Conversion Expectations**:
- High-Value Leads: 15-25% conversion to mortgage
- Prime Leads: 8-15% conversion
- Nurture Leads: 3-8% conversion
- Long-term Leads: 1-3% conversion

## Disclaimer
This logic is based on statistical correlations and industry data. Individual circumstances vary significantly. This model provides directional guidance for lead prioritization and should be combined with direct qualification conversations for accurate assessment.

## Data Sources
- The Knot Wedding Studies (2020-2023)
- Federal Reserve Consumer Finance Survey
- National Association of Realtors Market Reports
- Mortgage Bankers Association Industry Data
- Census Bureau Household Income Statistics