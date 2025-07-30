import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  if (!process.env.GROQ_API_KEY) {
    return Response.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  try {
    const { input } = await request.json();

    if (!input || input.trim().length === 0) {
      return Response.json(
        { error: "Input is required" },
        { status: 400 }
      );
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert analyst who helps people make better decisions by breaking down complex scenarios into clear, actionable insights.

When given a scenario, provide:
1. A brief summary of the situation
2. Key factors to consider (3-5 main points)
3. Pros and cons analysis
4. A recommendation with reasoning
5. Key metrics or data points that matter most
6. A Mermaid flowchart visualization

Format your response as JSON with this structure:
{
  "summary": "Brief overview of the situation",
  "keyFactors": ["factor1", "factor2", "factor3"],
  "analysis": {
    "pros": ["pro1", "pro2"],
    "cons": ["con1", "con2"]
  },
  "recommendation": "Clear recommendation with reasoning",
  "metrics": ["metric1", "metric2"],
  "mermaidChart": "flowchart TD\\n    A[Start] --> B[Decision Point]\\n    B --> C[Option 1]\\n    B --> D[Option 2]\\n    C --> E[Outcome 1]\\n    D --> F[Outcome 2]",
  "chartData": {
    "title": "Cost vs Benefit Analysis Over Time",
    "type": "line",
    "xAxis": "Years",
    "yAxis": "Net Savings ($)",
    "data": [
      {"name": "Year 1", "Option A": 1200, "Option B": 800},
      {"name": "Year 2", "Option A": 2800, "Option B": 2100},
      {"name": "Year 3", "Option A": 4600, "Option B": 3800},
      {"name": "Year 4", "Option A": 6800, "Option B": 5900},
      {"name": "Year 5", "Option A": 9200, "Option B": 8400}
    ]
  }
}

For the mermaidChart field, create a COMPACT Mermaid flowchart (4-6 nodes max) that shows the core decision path efficiently. Always use our color styling:

For the chartData field, generate relevant chart data based on the scenario. Choose the appropriate chart type and provide realistic data that supports the analysis:

**Compact Decision Flow Example:**
flowchart TD
    A[Current Situation] --> B{Key Decision}
    B -->|Option 1| C[Outcome A]
    B -->|Option 2| D[Outcome B]
    C --> E[Recommendation]
    D --> E
    
    classDef default fill:#F2EDE5,stroke:#B8956F,stroke-width:2px,color:#2D2D2D
    classDef decision fill:#D4B896,stroke:#6B5A44,stroke-width:2px,color:#2D2D2D

**Chart Data Guidelines:**
- ONLY generate data based on your actual knowledge, research, and documented information
- DO NOT make assumptions or create hypothetical numbers - if you don't know specific data, indicate this clearly
- Use publicly available data, industry standards, or well-documented benchmarks when possible
- If exact data isn't available, clearly label estimates and explain your reasoning
- Include proper axis labels (xAxis: what's being measured horizontally, yAxis: what's being measured vertically)  
- Use appropriate chart types: line (trends over time), bar (category comparisons)
- Provide 4-8 data points with meaningful names
- Data should directly support the decision analysis
- Include specific units (dollars, percentages, years, etc.)
- Make data actionable and relevant to the user's scenario
- When data is unavailable, focus on qualitative insights instead of generating fake numbers

**Mermaid Guidelines:**
- Keep it compact: 4-6 nodes maximum
- Focus on the core decision path only
- Use clear, specific node labels
- Always include the classDef styling shown above

Be practical, evidence-based, and focus on actionable insights. Keep explanations clear and concise.`
        },
        {
          role: "user",
          content: input
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0]?.message?.content;
    
    if (!responseText) {
      throw new Error("No response from AI");
    }

    let analysisResult;
    try {
      analysisResult = JSON.parse(responseText);
    } catch (parseError) {
      analysisResult = {
        summary: responseText.substring(0, 200) + "...",
        keyFactors: ["Analysis provided as text"],
        analysis: {
          pros: ["See detailed analysis"],
          cons: ["Review all considerations"]
        },
        recommendation: "Please review the full analysis",
        metrics: ["Detailed analysis available"],
        mermaidChart: "flowchart TD\n    A[Scenario] --> B[Analysis Complete]\n    B --> C[Review Results]\n    C --> D[Make Decision]",
        fullText: responseText
      };
    }

    return Response.json({
      success: true,
      data: analysisResult
    });

  } catch (error) {
    console.error("Analysis error:", error);
    
    if (error instanceof Error) {
      if (error.message.includes('API key') || error.message.includes('authentication')) {
        return Response.json(
          { 
            error: "API configuration issue",
            details: "Please check your API key setup",
            userMessage: "We're having trouble connecting to our analysis service. Please try again in a moment."
          },
          { status: 500 }
        );
      }
      if (error.message.includes('rate limit') || error.message.includes('429')) {
        return Response.json(
          { 
            error: "Rate limit exceeded",
            details: error.message,
            userMessage: "We're receiving high traffic. Please wait a moment and try again."
          },
          { status: 429 }
        );
      }
      if (error.message.includes('network') || error.message.includes('timeout')) {
        return Response.json(
          { 
            error: "Network error",
            details: error.message,
            userMessage: "Connection issue detected. Please check your internet and try again."
          },
          { status: 503 }
        );
      }
    }
    return Response.json(
      { 
        error: "Analysis failed",
        details: error instanceof Error ? error.message : "Unknown error",
        userMessage: "Sorry, we couldn't analyze your scenario right now. Please try again."
      },
      { status: 500 }
    );
  }
}
