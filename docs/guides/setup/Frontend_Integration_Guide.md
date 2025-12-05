# Frontend Integration Guide

## Overview
This guide covers integrating the enhanced analysis engine features into your React frontend.

## New Hooks to Create

### 1. useComparativeAnalysis Hook

```typescript
// client/src/hooks/useComparativeAnalysis.ts

import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api';

export interface AnalysisWeights {
  ranking: number;
  cost: number;
  acceptance: number;
  employmentRate: number;
  studentSatisfaction: number;
  research: number;
  targetSalary?: number;
  careerFocus?: string;
  preferredLocation?: string;
  internshipImportant?: boolean;
  researchImportant?: boolean;
}

export const useComparativeAnalysis = () => {
  const [analysis, setAnalysis] = useState(null);
  const [insights, setInsights] = useState(null);
  const [risks, setRisks] = useState(null);
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = useCallback(async (
    universityIds: string[],
    weights?: Partial<AnalysisWeights>
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.post('/compare/analyze', {
        universityIds,
        weights
      });
      
      setAnalysis(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getInsights = useCallback(async (universityIds: string[]) => {
    try {
      setLoading(true);
      const response = await apiClient.post('/compare/insights', {
        universityIds
      });
      setInsights(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getRiskAssessment = useCallback(async (universityIds: string[]) => {
    try {
      setLoading(true);
      const response = await apiClient.post('/compare/risks', {
        universityIds
      });
      setRisks(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getTrends = useCallback(async (universityIds: string[]) => {
    try {
      setLoading(true);
      const response = await apiClient.post('/compare/trends', {
        universityIds
      });
      setTrends(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    analysis,
    insights,
    risks,
    trends,
    loading,
    error,
    runAnalysis,
    getInsights,
    getRiskAssessment,
    getTrends
  };
};
```

### 2. useAnalysisWeights Hook

```typescript
// client/src/hooks/useAnalysisWeights.ts

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api';

export const useAnalysisWeights = () => {
  const [weights, setWeights] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch current weights on mount
  useEffect(() => {
    fetchWeights();
  }, []);

  const fetchWeights = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/compare/weights');
      setWeights(response.data);
    } catch (err: any) {
      console.log('No custom weights set yet');
      setWeights(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const setCustomWeights = useCallback(async (newWeights: any) => {
    try {
      setLoading(true);
      const response = await apiClient.post('/compare/weights', newWeights);
      setWeights(response.data);
      return response.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    weights,
    loading,
    error,
    fetchWeights,
    setCustomWeights
  };
};
```

### 3. useComparisonReports Hook

```typescript
// client/src/hooks/useComparisonReports.ts

import { apiClient } from '@/lib/api';

export const useComparisonReports = () => {
  const generateHTMLReport = async (universityIds: string[]) => {
    const response = await apiClient.post('/compare/report/html', {
      universityIds
    });
    return response.data;
  };

  const generateCSVReport = async (universityIds: string[]) => {
    const response = await apiClient.post('/compare/report/csv', {
      universityIds
    }, {
      responseType: 'blob'
    });
    
    // Trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'university-comparison.csv');
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  };

  const generateJSONReport = async (universityIds: string[]) => {
    const response = await apiClient.post('/compare/report/json', {
      universityIds
    }, {
      responseType: 'blob'
    });
    
    // Trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'university-comparison.json');
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  };

  const sendEmailReport = async (universityIds: string[], recipientEmail: string) => {
    const response = await apiClient.post('/compare/report/email', {
      universityIds,
      recipientEmail
    });
    return response.data;
  };

  const createShareableLink = async (comparisonId: string) => {
    const response = await apiClient.post('/compare/share', {
      comparisonId
    });
    return response.data;
  };

  return {
    generateHTMLReport,
    generateCSVReport,
    generateJSONReport,
    sendEmailReport,
    createShareableLink
  };
};
```

---

## New Components to Create

### 1. WeightsConfiguration Component

```typescript
// client/src/components/compare/WeightsConfiguration.tsx

import { useState } from 'react';
import { useAnalysisWeights } from '@/hooks/useAnalysisWeights';
import { Slider, Button, Input, Select } from '@/components/ui';

export const WeightsConfiguration = ({ onWeightsSet }: any) => {
  const { weights, setCustomWeights } = useAnalysisWeights();
  const [localWeights, setLocalWeights] = useState(weights || {
    ranking: 0.25,
    cost: 0.25,
    acceptance: 0.15,
    employmentRate: 0.15,
    studentSatisfaction: 0.10,
    research: 0.10
  });

  const handleWeightChange = (key: string, value: number) => {
    setLocalWeights(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    await setCustomWeights(localWeights);
    onWeightsSet?.(localWeights);
  };

  const totalWeight = Object.values(localWeights).reduce((a: any, b: any) => a + b, 0);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Customize Analysis Weights</h2>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Ranking Importance</label>
          <Slider 
            value={localWeights.ranking * 100}
            onChange={(val) => handleWeightChange('ranking', val / 100)}
            max={100}
          />
          <p className="text-xs text-gray-500">{(localWeights.ranking * 100).toFixed(0)}%</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Cost Importance</label>
          <Slider 
            value={localWeights.cost * 100}
            onChange={(val) => handleWeightChange('cost', val / 100)}
            max={100}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Acceptance Rate</label>
          <Slider 
            value={localWeights.acceptance * 100}
            onChange={(val) => handleWeightChange('acceptance', val / 100)}
            max={100}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Employment Rate</label>
          <Slider 
            value={localWeights.employmentRate * 100}
            onChange={(val) => handleWeightChange('employmentRate', val / 100)}
            max={100}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Student Satisfaction</label>
          <Slider 
            value={localWeights.studentSatisfaction * 100}
            onChange={(val) => handleWeightChange('studentSatisfaction', val / 100)}
            max={100}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Research Quality</label>
          <Slider 
            value={localWeights.research * 100}
            onChange={(val) => handleWeightChange('research', val / 100)}
            max={100}
          />
        </div>
      </div>

      <div className="mb-6 p-3 bg-blue-50 rounded">
        <p className="text-sm">
          Total Weight: <strong>{(totalWeight * 100).toFixed(0)}%</strong>
          {Math.abs(totalWeight - 1) > 0.01 && (
            <span className="text-orange-600 ml-2">⚠️ Should sum to 100%</span>
          )}
        </p>
      </div>

      <Button onClick={handleSave} className="w-full">
        Save Custom Weights
      </Button>
    </div>
  );
};
```

### 2. RiskAssessmentCard Component

```typescript
// client/src/components/compare/RiskAssessmentCard.tsx

export const RiskAssessmentCard = ({ riskAssessment }: any) => {
  const getRiskColor = (severity: string) => {
    switch(severity) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-bold mb-2">{riskAssessment.universityName}</h3>
      
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm">Risk Score</span>
          <span className="font-bold">{riskAssessment.overallRiskScore}/100</span>
        </div>
        <div className="w-full bg-gray-200 rounded h-2">
          <div 
            className="bg-red-500 h-2 rounded"
            style={{ width: `${riskAssessment.overallRiskScore}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        {riskAssessment.riskFactors.map((factor: any, idx: number) => (
          <div key={idx} className={`p-2 rounded ${getRiskColor(factor.severity)}`}>
            <p className="text-sm font-medium">{factor.factor}</p>
            <p className="text-xs">{factor.description}</p>
          </div>
        ))}
      </div>

      {riskAssessment.recommendations.length > 0 && (
        <div className="mt-3 p-2 bg-blue-50 rounded">
          <p className="text-xs font-medium mb-1">Recommendations:</p>
          <ul className="text-xs space-y-1">
            {riskAssessment.recommendations.map((rec: string, idx: number) => (
              <li key={idx}>• {rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
```

### 3. InsightsPanel Component

```typescript
// client/src/components/compare/InsightsPanel.tsx

export const InsightsPanel = ({ insights }: any) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Comparative Insights</h2>

      {insights.costBenefit && (
        <div className="mb-6 p-4 bg-blue-50 rounded">
          <h3 className="font-bold text-blue-900 mb-2">💰 Financial Analysis</h3>
          <p className="text-sm text-blue-800">{insights.costBenefit}</p>
        </div>
      )}

      {insights.careerOutcomes && (
        <div className="mb-6 p-4 bg-green-50 rounded">
          <h3 className="font-bold text-green-900 mb-2">📈 Career Outcomes</h3>
          <p className="text-sm text-green-800">{insights.careerOutcomes}</p>
        </div>
      )}

      {insights.acceptanceDifficulty && (
        <div className="mb-6 p-4 bg-purple-50 rounded">
          <h3 className="font-bold text-purple-900 mb-2">🎓 Admission Difficulty</h3>
          <p className="text-sm text-purple-800">{insights.acceptanceDifficulty}</p>
        </div>
      )}

      {insights.studentExperience && (
        <div className="mb-6 p-4 bg-orange-50 rounded">
          <h3 className="font-bold text-orange-900 mb-2">🎉 Student Experience</h3>
          <p className="text-sm text-orange-800">{insights.studentExperience}</p>
        </div>
      )}

      {insights.researchOpportunities && (
        <div className="mb-6 p-4 bg-indigo-50 rounded">
          <h3 className="font-bold text-indigo-900 mb-2">🔬 Research Opportunities</h3>
          <p className="text-sm text-indigo-800">{insights.researchOpportunities}</p>
        </div>
      )}

      {insights.internationalOpportunities && (
        <div className="p-4 bg-pink-50 rounded">
          <h3 className="font-bold text-pink-900 mb-2">🌍 International Support</h3>
          <p className="text-sm text-pink-800">{insights.internationalOpportunities}</p>
        </div>
      )}
    </div>
  );
};
```

### 4. ReportExporter Component

```typescript
// client/src/components/compare/ReportExporter.tsx

import { useState } from 'react';
import { useComparisonReports } from '@/hooks/useComparisonReports';
import { Button, Input, Modal } from '@/components/ui';

export const ReportExporter = ({ universityIds }: any) => {
  const { generateHTMLReport, generateCSVReport, generateJSONReport, sendEmailReport } = useComparisonReports();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleExportHTML = async () => {
    setLoading(true);
    try {
      const html = await generateHTMLReport(universityIds);
      const blob = new Blob([html], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'comparison.html');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!email) return;
    setLoading(true);
    try {
      await sendEmailReport(universityIds, email);
      alert('Report sent successfully!');
      setShowEmailModal(false);
      setEmail('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button onClick={handleExportHTML} disabled={loading}>
        📄 Export as HTML
      </Button>
      <Button onClick={() => generateCSVReport(universityIds)} disabled={loading}>
        📊 Export as CSV
      </Button>
      <Button onClick={() => generateJSONReport(universityIds)} disabled={loading}>
        📋 Export as JSON
      </Button>
      <Button onClick={() => setShowEmailModal(true)} disabled={loading}>
        📧 Send Email
      </Button>

      <Modal isOpen={showEmailModal} onClose={() => setShowEmailModal(false)}>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">Send Comparison Report</h3>
          <Input
            type="email"
            placeholder="Recipient email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4"
          />
          <Button onClick={handleSendEmail} className="w-full">
            Send
          </Button>
        </div>
      </Modal>
    </div>
  );
};
```

---

## Integration in Comparison Page

```typescript
// client/src/pages/compare/ComparePage.tsx

import { useEffect, useState } from 'react';
import { useComparativeAnalysis } from '@/hooks/useComparativeAnalysis';
import { useAnalysisWeights } from '@/hooks/useAnalysisWeights';
import { WeightsConfiguration } from '@/components/compare/WeightsConfiguration';
import { RiskAssessmentCard } from '@/components/compare/RiskAssessmentCard';
import { InsightsPanel } from '@/components/compare/InsightsPanel';
import { ReportExporter } from '@/components/compare/ReportExporter';

export const ComparePage = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const universityIds = searchParams.get('ids')?.split(',') || [];
  
  const { analysis, insights, risks, runAnalysis, getInsights, getRiskAssessment } = useComparativeAnalysis();
  const { weights } = useAnalysisWeights();
  const [showWeights, setShowWeights] = useState(false);

  useEffect(() => {
    if (universityIds.length > 0) {
      runAnalysis(universityIds, weights);
      getInsights(universityIds);
      getRiskAssessment(universityIds);
    }
  }, [universityIds, weights]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">University Comparison</h1>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="col-span-3">
          <button
            onClick={() => setShowWeights(!showWeights)}
            className="mb-4 p-2 bg-blue-500 text-white rounded w-full"
          >
            {showWeights ? 'Hide' : 'Customize'} Weights
          </button>
          
          {showWeights && (
            <WeightsConfiguration onWeightsSet={() => setShowWeights(false)} />
          )}

          <div className="mt-6">
            <ReportExporter universityIds={universityIds} />
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-9 space-y-6">
          {/* Metrics */}
          {analysis && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">Key Metrics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Avg Cost</p>
                  <p className="text-2xl font-bold">${(analysis.metrics.averageCost / 1000).toFixed(0)}K</p>
                </div>
                <div>
                  <p className="text-gray-600">Avg Ranking</p>
                  <p className="text-2xl font-bold">#{analysis.metrics.averageRanking.toFixed(0)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Employment Rate</p>
                  <p className="text-2xl font-bold">{(analysis.metrics.averageEmploymentRate * 100).toFixed(0)}%</p>
                </div>
                <div>
                  <p className="text-gray-600">Avg Salary</p>
                  <p className="text-2xl font-bold">${(analysis.metrics.averageStartingSalary / 1000).toFixed(0)}K</p>
                </div>
              </div>
            </div>
          )}

          {/* Recommendations */}
          {analysis && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">Smart Recommendations</h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(analysis.recommendations).map(([key, rec]: any) => (
                  <div key={key} className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded">
                    <p className="text-sm font-medium text-gray-600 mb-1">{key.replace(/([A-Z])/g, ' $1')}</p>
                    <p className="font-bold text-lg mb-2">{rec.universityName}</p>
                    <p className="text-sm">{rec.reason}</p>
                    <div className="mt-2">
                      <span className="inline-block bg-blue-500 text-white px-3 py-1 rounded text-sm font-bold">
                        {rec.score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Insights */}
          {insights && <InsightsPanel insights={insights} />}

          {/* Risk Assessment */}
          {risks && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">Risk Assessment</h2>
              <div className="grid grid-cols-1 gap-4">
                {risks.riskAssessments.map((risk: any) => (
                  <RiskAssessmentCard key={risk.universityId} riskAssessment={risk} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
```

---

## API Integration Examples

### Example: Complete Analysis Flow

```typescript
async function runCompleteAnalysis(universityIds: string[]) {
  const { runAnalysis, getInsights, getRiskAssessment, getTrends } = useComparativeAnalysis();

  // 1. Get base analysis
  await runAnalysis(universityIds);

  // 2. Get insights
  await getInsights(universityIds);

  // 3. Get risk assessment
  await getRiskAssessment(universityIds);

  // 4. Get trends
  await getTrends(universityIds);

  // All data is now available in state
}
```

### Example: Custom Weight Analysis

```typescript
async function analyzeWithCustomWeights() {
  const weights = {
    ranking: 0.35,      // Prioritize ranking
    cost: 0.20,
    acceptance: 0.10,
    employmentRate: 0.20,
    studentSatisfaction: 0.10,
    research: 0.05
  };

  const { runAnalysis } = useComparativeAnalysis();
  await runAnalysis(universityIds, weights);
}
```

---

## Styling Recommendations

Use Tailwind CSS classes for consistency:
- Primary colors: `blue-500`, `blue-600`
- Danger: `red-500`, `red-600`
- Success: `green-500`, `green-600`
- Warning: `yellow-500`, `yellow-600`
- Neutral: `gray-500`, `gray-600`

---

## Error Handling

All hooks include error state management:

```typescript
const { analysis, error, loading } = useComparativeAnalysis();

if (error) {
  return <div className="p-4 bg-red-50 text-red-700 rounded">{error}</div>;
}

if (loading) {
  return <LoadingSpinner />;
}
```

---

## Performance Optimization

- Use memoization for heavy components: `React.memo()`
- Implement pagination for large result sets
- Cache analysis results
- Lazy load insights/trends
- Debounce weight changes

---

## Testing

Example test for WeightsConfiguration:

```typescript
import { render, fireEvent, waitFor } from '@testing-library/react';
import { WeightsConfiguration } from './WeightsConfiguration';

test('updates weights and calls onWeightsSet', async () => {
  const onWeightsSet = jest.fn();
  const { getByText } = render(
    <WeightsConfiguration onWeightsSet={onWeightsSet} />
  );

  fireEvent.click(getByText('Save Custom Weights'));
  
  await waitFor(() => {
    expect(onWeightsSet).toHaveBeenCalled();
  });
});
```
