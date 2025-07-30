
'use client';

import React, { useState } from 'react';
import MermaidDiagram from './components/MermaidDiagram';
import Chart from './components/Chart';

interface AnalysisResult {
  summary: string;
  keyFactors?: string[];
  analysis?: {
    pros?: string[];
    cons?: string[];
  };
  recommendation?: string;
  metrics?: string[];
  mermaidChart?: string;
  chartData?: {
    title: string;
    type: 'line' | 'bar';
    xAxis: string;
    yAxis: string;
    data: Array<Record<string, any>>;
  };
  error?: boolean;
  errorType?: string;
  fullText?: string;
}

export default function Home() {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setIsAnalyzing(true);
    setShowResults(false);
    setResult(null);
    
    try {
      const response = await fetch('/api/effective', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: input.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setResult(data.data);
      setShowResults(true);
      
      setTimeout(() => {
        const resultsElement = document.getElementById('analysis-results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 300);
    } catch (error) {
      console.error('Analysis error:', error);
      
      let errorMessage = 'We encountered an unexpected error. Please try again.';
      let errorDetails = 'Please check your connection and try again.';
      
      if (error instanceof Error) {
        try {
          const errorData = JSON.parse(error.message);
          errorMessage = errorData.userMessage || errorMessage;
          errorDetails = errorData.details || errorDetails;
        } catch {
          if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Connection issue detected. Please check your internet and try again.';
            errorDetails = 'Network connectivity problem';
          } else if (error.message.includes('500')) {
            errorMessage = 'Our analysis service is temporarily unavailable.';
            errorDetails = 'Server error - please try again in a moment';
          }
        }
      }
      
      setResult({
        summary: errorMessage,
        keyFactors: [errorDetails],
        analysis: { pros: [], cons: [] },
        recommendation: 'If this problem persists, please try refreshing the page or come back later.',
        metrics: [],
        error: true,
        errorType: 'api_error'
      } as AnalysisResult);
      
      setShowResults(true);
      
      setTimeout(() => {
        const resultsElement = document.getElementById('analysis-results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 300);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const placeholderExamples = [
    "Should I buy a house now or wait for interest rates to drop?",
    "Compare working remotely vs relocating for a 40% salary increase",
    "Is it worth paying off student loans early vs investing in index funds?",
    "Analyze switching from iPhone to Android: ecosystem lock-in vs savings",
    "Should I start a side business or focus on climbing the corporate ladder?",
    "Compare leasing vs buying a car for my 50-mile daily commute"
  ];

  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);

  const handleStartOver = () => {
    setShowResults(false);
    setResult(null);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-8 py-16 transform">
        {!showResults && (
          <header className="text-center mb-24 pt-16">
            <h1 className="text-6xl text-primary mb-8" style={{ fontFamily: 'var(--font-handwritten)' }}>
              evalico
            </h1>
            <p className="text-2xl text-neutral-dark max-w-3xl mx-auto leading-relaxed font-light">
              describe your situation and get intelligent analysis
            </p>
          </header>
        )}

        <div className={`max-w-4xl mx-auto ${showResults ? 'mb-8' : 'mb-24'}`}>
          {isAnalyzing && !showResults && (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="mb-8">
                <div className="breathing-dots">
                  <div className="breathing-dot"></div>
                  <div className="breathing-dot"></div>
                  <div className="breathing-dot"></div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-2xl text-primary font-light mb-4" style={{ fontFamily: 'var(--font-handwritten)' }}>
                  thinking through your scenario
                </p>
                <p className="text-neutral-dark/70 text-sm font-light max-w-md">
                  we're analyzing all the factors and considerations for your decision
                </p>
              </div>
            </div>
          )}

          {!showResults && !isAnalyzing && (
            <form onSubmit={handleSubmit} className="mb-16 premium-transition">
              <div>
              <div className="mb-6">
                <label className="text-2xl text-foreground/90 font-light" style={{ fontFamily: 'var(--font-handwritten)' }}>
                  what's on your mind?
                </label>
                <p className="text-neutral-dark/70 mt-2 text-base leading-relaxed">
                  describe your situation and we'll help you think through it
                </p>
              </div>

              <div className="input-container bg-neutral/60 backdrop-blur-sm border border-border/40 rounded-3xl gentle-shadow 
                            hover:bg-neutral/80 hover:border-primary/40 focus-within:border-primary/60 focus-within:bg-neutral/90 focus-within:shadow-xl">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={placeholderExamples[currentPlaceholder]}
                  className="w-full h-48 p-10 text-xl bg-transparent resize-none 
                           placeholder-neutral-dark/50 focus:outline-none border-none leading-relaxed
                           text-foreground font-light"
                  onFocus={() => {
                    setCurrentPlaceholder((prev) => (prev + 1) % placeholderExamples.length);
                  }}
                />
                
                <div className="flex items-center justify-between px-10 pb-8 pt-4 border-t border-border/30">
                  <div className="flex items-center gap-4">
                    <span className="text-neutral-dark/50 text-sm font-light">
                      {input.length === 0 ? 'start typing...' : `${input.length} characters`}
                    </span>
                    {input.length > 20 && (
                      <span className="text-secondary text-sm font-medium">
                        looking good
                      </span>
                    )}
                  </div>
                  
                  <button
                    type="submit"
                    disabled={!input.trim() || isAnalyzing}
                    className="px-10 py-4 bg-primary/90 hover:bg-primary text-white font-light rounded-2xl 
                             calm-transition disabled:opacity-40 disabled:cursor-not-allowed 
                             gentle-shadow transform hover:scale-[1.02] active:scale-[0.98]
                             disabled:transform-none backdrop-blur-sm"
                  >
                    {isAnalyzing ? (
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                        <span className="pulse-gentle font-light">analyzing...</span>
                      </div>
                    ) : (
                      'analyze'
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-neutral-dark/60 text-sm font-light">
                  the more details you share, the better we can help
                </p>
              </div>
            </div>
          </form>
          )}

          {!showResults && !isAnalyzing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20 premium-transition">
            {placeholderExamples.slice(0, 4).map((example, index) => (
              <button
                key={index}
                onClick={() => setInput(example)}
                className="p-6 text-left bg-white/30 hover:bg-white/50 rounded-2xl
                         calm-transition text-foreground/80 hover:text-foreground leading-relaxed
                         gentle-shadow transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="text-primary font-medium text-sm">try:</span>
                <div className="mt-1 text-base">{example}</div>
              </button>
            ))}
          </div>
          )}

          {result && showResults && (
            <div className="space-y-8" id="analysis-results">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl text-primary font-light" style={{ fontFamily: 'var(--font-handwritten)' }}>
                  your analysis
                </h2>
                <button
                  onClick={handleStartOver}
                  className="group px-8 py-3 text-white hover:text-white bg-primary hover:bg-primary/90 
                           border border-primary hover:border-primary/90 rounded-2xl calm-transition 
                           text-sm font-medium gentle-shadow transform hover:scale-[1.02] active:scale-[0.98]
                           backdrop-blur-sm"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    analyze something new
                  </span>
                </button>
              </div>

              <div className="dashboard-grid">
                <div className="left-column">
                  <div className="dashboard-card bg-white/40 backdrop-blur-sm rounded-3xl p-8 gentle-shadow">
                    <h3 className="text-xl text-foreground/90 mb-6 font-medium">Summary & Key Factors</h3>
                    
                    <div className="mb-6">
                      <p className="text-foreground/80 text-lg leading-relaxed mb-6">
                        {result.summary}
                      </p>
                    </div>

                    {result.keyFactors && result.keyFactors.length > 0 && (
                      <div>
                        <ul className="space-y-3">
                          {result.keyFactors.map((factor, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0 pulse-gentle"></div>
                              <span className="text-foreground/80 leading-relaxed">{factor}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {result.analysis && (
                    <div className="dashboard-card bg-white/40 backdrop-blur-sm rounded-3xl p-8 gentle-shadow">
                      <h3 className="text-xl text-foreground/90 mb-6 font-medium">Analysis</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {result.analysis.pros && result.analysis.pros.length > 0 && (
                          <div>
                            <h4 className="text-lg text-secondary mb-3 font-medium">Pros</h4>
                            <ul className="space-y-2">
                              {result.analysis.pros.map((pro, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-foreground/80 text-sm leading-relaxed">{pro}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {result.analysis.cons && result.analysis.cons.length > 0 && (
                          <div>
                            <h4 className="text-lg text-primary-light mb-3 font-medium">Cons</h4>
                            <ul className="space-y-2">
                              {result.analysis.cons.map((con, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 bg-primary-light rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-foreground/80 text-sm leading-relaxed">{con}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="dashboard-card bg-white/40 backdrop-blur-sm rounded-3xl p-8 gentle-shadow">
                    <h3 className="text-xl text-foreground/90 mb-6 font-medium">Insights</h3>
                    
                    {result.recommendation && (
                      <div className="mb-6">
                        <h4 className="text-lg text-foreground/90 mb-3 font-medium">Recommendation</h4>
                        <div className="bg-primary/10 rounded-2xl p-4">
                          <p className="text-foreground/80 leading-relaxed">
                            {result.recommendation}
                          </p>
                        </div>
                      </div>
                    )}

                    {result.metrics && result.metrics.length > 0 && (
                      <div>
                        <h4 className="text-lg text-foreground/90 mb-3 font-medium">Key Metrics</h4>
                        <div className="space-y-2">
                          {result.metrics.map((metric, index) => (
                            <div key={index} className="bg-neutral/30 border border-neutral/40 text-foreground/80 px-3 py-2 rounded-xl text-sm leading-relaxed">
                              {metric}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="right-column">
                  <div className="dashboard-card bg-white/40 backdrop-blur-sm rounded-3xl p-8 gentle-shadow">
                    <h3 className="text-xl text-foreground/90 mb-6 font-medium">Decision Flow</h3>
                    <div className="bg-white/60 rounded-2xl p-6 gentle-shadow flex-1 flex items-center justify-center">
                      <MermaidDiagram
                        chart={result.mermaidChart || 'flowchart TD\n    A[Start] --> B[Loading...]'}
                        className="w-full h-full"
                      />
                    </div>
                  </div>

                  {result.chartData && (
                    <div className="dashboard-card bg-white/40 backdrop-blur-sm rounded-3xl p-8 gentle-shadow">
                      <h3 className="text-xl text-foreground/90 mb-6 font-medium">Data Insights</h3>
                      <div className="bg-white/60 rounded-2xl p-6 gentle-shadow flex-1">
                        <Chart
                          title={result.chartData.title}
                          type={result.chartData.type}
                          xAxis={result.chartData.xAxis}
                          yAxis={result.chartData.yAxis}
                          data={result.chartData.data}
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {result.error && (
                <div className="bg-primary-light/10 rounded-2xl p-6 border border-primary-light/20">
                  <p className="text-primary-light text-lg">
                    {result.summary}
                  </p>
                </div>
              )}

              {result.fullText && (
                <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-8 gentle-shadow">
                  <h3 className="text-lg text-foreground/90 mb-3 font-medium">Detailed Analysis</h3>
                  <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                    {result.fullText}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
