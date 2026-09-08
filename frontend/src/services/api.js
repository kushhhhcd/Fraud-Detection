/**
 * Centralized API Service for Sentinel Fraud Detection & Drift Monitoring
 * Connects exclusively to endpoints existing in the FastAPI backend:
 *   - /users
 *   - /transactions
 *   - /models
 *   - /frauds
 *   - /drift-reports
 *
 * Configurable via VITE_API_BASE_URL (defaults to '/api' with Vite proxy,
 * or direct 'http://localhost:8000').
 */

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData?.detail) {
          errorMessage = typeof errorData.detail === 'string' 
            ? errorData.detail 
            : JSON.stringify(errorData.detail);
        }
      } catch {
        // Response was not JSON
      }
      throw new Error(errorMessage);
    }

    // Return empty object for 204 No Content
    if (response.status === 204) return {};
    return await response.json();
  } catch (err) {
    console.error(`[API Error] ${options.method || 'GET'} ${url}:`, err.message);
    throw err;
  }
}

export const api = {
  // ==========================================
  // Health & Root
  // ==========================================
  checkRoot: () => apiRequest('/'),

  // ==========================================
  // Users API (/users)
  // ==========================================
  getUsers: (skip = 0, limit = 100) => 
    apiRequest(`/users/?skip=${skip}&limit=${limit}`),

  getUser: (userId) => 
    apiRequest(`/users/${userId}`),

  createUser: (userData) => 
    apiRequest('/users/', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  updateUser: (userId, userData) => 
    apiRequest(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),

  deleteUser: (userId) => 
    apiRequest(`/users/${userId}`, {
      method: 'DELETE',
    }),

  // ==========================================
  // Transactions API (/transactions)
  // ==========================================
  getTransactions: (skip = 0, limit = 100) => 
    apiRequest(`/transactions/?skip=${skip}&limit=${limit}`),

  getTransaction: (txId) => 
    apiRequest(`/transactions/${txId}`),

  createTransaction: (txData) => 
    apiRequest('/transactions/', {
      method: 'POST',
      body: JSON.stringify(txData),
    }),

  updateTransaction: (txId, txData) => 
    apiRequest(`/transactions/${txId}`, {
      method: 'PUT',
      body: JSON.stringify(txData),
    }),

  deleteTransaction: (txId) => 
    apiRequest(`/transactions/${txId}`, {
      method: 'DELETE',
    }),

  // ==========================================
  // Models API (/models)
  // ==========================================
  getModels: () => 
    apiRequest('/models/'),

  getModel: (modelId) => 
    apiRequest(`/models/${modelId}`),

  createModel: (modelData) => 
    apiRequest('/models/', {
      method: 'POST',
      body: JSON.stringify(modelData),
    }),

  updateModel: (modelId, modelData) => 
    apiRequest(`/models/${modelId}`, {
      method: 'PUT',
      body: JSON.stringify(modelData),
    }),

  deleteModel: (modelId) => 
    apiRequest(`/models/${modelId}`, {
      method: 'DELETE',
    }),

  // ==========================================
  // Fraud Predictions API (/frauds)
  // ==========================================
  getFraudPredictions: () => 
    apiRequest('/frauds/'),

  getFraudPrediction: (predictionId) => 
    apiRequest(`/frauds/${predictionId}`),

  createFraudPrediction: (predData) => 
    apiRequest('/frauds/', {
      method: 'POST',
      body: JSON.stringify(predData),
    }),

  deleteFraudPrediction: (predictionId) => 
    apiRequest(`/frauds/${predictionId}`, {
      method: 'DELETE',
    }),

  // ==========================================
  // Drift Reports API (/drift-reports)
  // ==========================================
  getDriftReports: () => 
    apiRequest('/drift-reports/'),

  getDriftReport: (reportId) => 
    apiRequest(`/drift-reports/${reportId}`),

  createDriftReport: (reportData) => 
    apiRequest('/drift-reports/', {
      method: 'POST',
      body: JSON.stringify(reportData),
    }),

  deleteDriftReport: (reportId) => 
    apiRequest(`/drift-reports/${reportId}`, {
      method: 'DELETE',
    }),

  // =========================================================================
  // PENDING ML & BACKEND ENDPOINTS (Explicit TODO Markers)
  // These features do not yet exist in the FastAPI repo and will be hooked up
  // when ML / auth components are implemented.
  // =========================================================================

  // TODO: Authentication Endpoint (POST /auth/login)
  // Currently users table exists, but no auth token generation route exists.
  authLogin: async (credentials) => {
    console.warn('[PENDING_API] POST /auth/login is not implemented in backend. Using local session.');
    return {
      status: 'pending_implementation',
      message: 'Auth backend route (POST /auth/login) pending implementation in routes/users.py',
      credentials,
    };
  },

  // TODO: Real-Time ML Inference (POST /predict)
  // Backend ml/predict.py is currently empty.
  predictTransaction: async (features) => {
    console.warn('[PENDING_API] POST /predict is not implemented in backend.');
    return {
      status: 'pending_implementation',
      message: 'Model inference route (POST /predict) pending implementation in ml/predict.py',
      features,
    };
  },

  // TODO: SHAP Explainability Generation (GET /frauds/{id}/shap or POST /predict/explain)
  // Feature attribution bar plots rely on TreeExplainer.
  getShapExplanation: async (transactionId) => {
    console.warn('[PENDING_API] SHAP calculation endpoint is not implemented in backend.');
    return {
      status: 'pending_implementation',
      message: 'SHAP calculation route pending TreeExplainer implementation in ml/predict.py',
      transactionId,
    };
  },

  // TODO: Automated Retrain Pipeline Trigger (POST /models/retrain)
  // Backend ml/train.py is currently empty.
  triggerRetrainPipeline: async (config) => {
    console.warn('[PENDING_API] POST /models/retrain is not implemented in backend.');
    return {
      status: 'pending_implementation',
      message: 'Retrain pipeline route (POST /models/retrain) pending implementation in ml/train.py',
      config,
    };
  },

  // TODO: Dedicated Alerts Management (GET /alerts/)
  // Alert table does not exist in database_models.py; alerts are derived from drift_reports and high fraud scores.
  getAlerts: async () => {
    console.warn('[PENDING_API] Dedicated /alerts router is not implemented in backend.');
    return {
      status: 'pending_implementation',
      message: 'Dedicated alerts endpoint pending database model implementation in backend.',
    };
  },
};

export default api;
