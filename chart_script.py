import plotly.graph_objects as go
import plotly.io as pio

# Data for the chart
factors = ["Competitor Use", "Relevant Pers", "Company Size", "Intent Signals"]
weights = [40, 30, 20, 10]

# Brand colors in order
colors = ['#1FB8CD', '#FFC185', '#ECEBD5', '#5D878F']

# Create horizontal bar chart
fig = go.Figure()

fig.add_trace(go.Bar(
    y=factors,
    x=weights,
    orientation='h',
    marker_color=colors,
    text=[f"{w}%" for w in weights],
    textposition='inside',
    textfont=dict(size=14),
    cliponaxis=False
))

# Update layout
fig.update_layout(
    title="Lead Scoring Factors for B2B Prioritization",
    xaxis_title="Weight %",
    yaxis_title="",
    showlegend=False
)

# Update x-axis
fig.update_xaxes(range=[0, 45], dtick=10, ticksuffix="%")

# Update y-axis
fig.update_yaxes(categoryorder='total ascending')

# Save the chart
fig.write_image("lead_scoring_chart.png")