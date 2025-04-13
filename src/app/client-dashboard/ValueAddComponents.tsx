import { Check, CircleAlert, Database, Zap, DollarSign, Gauge, ClipboardCheck, Building } from 'lucide-react';

// Placeholder for Grow View
export const DataSourceHealthCheck = () => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition-shadow hover:shadow-xl">
    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <Database className="h-5 w-5 mr-2 text-blue-600" /> Data Source Health
    </h2>
    <div className="space-y-3 text-sm">
      <div className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" /> CRM Connection: <span className="ml-1 font-medium text-green-700">Connected</span></div>
      <div className="flex items-center"><CircleAlert className="h-4 w-4 mr-2 text-amber-500" /> Analytics Platform: <span className="ml-1 font-medium text-amber-700">Pending Setup</span></div>
      <div className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" /> ERP System: <span className="ml-1 font-medium text-green-700">Connected</span></div>
    </div>
    <p className="text-xs text-gray-500 mt-3">Ensuring data sources are ready for AI integration.</p>
  </div>
);

export const OpportunityTeaser = () => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition-shadow hover:shadow-xl">
    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <Zap className="h-5 w-5 mr-2 text-yellow-600" /> Potential AI Opportunities
    </h2>
    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
      <li>Enhance customer support responsiveness.</li>
      <li>Automate repetitive data entry tasks.</li>
    </ul>
    <p className="text-xs text-gray-500 mt-3">Based on preliminary analysis. Schedule consultation for details.</p>
  </div>
);

// Placeholder for Optimize View
export const SavingsEstimator = () => (
   <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition-shadow hover:shadow-xl">
    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <DollarSign className="h-5 w-5 mr-2 text-teal-600" /> Estimated Annual Savings
    </h2>
     <p className="text-3xl font-bold text-teal-700">~$85,000+</p>
     <p className="text-sm text-gray-500 mt-1">Potential based on optimizing key processes.</p>
  </div>
);

export const AutomationPotential = () => (
   <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition-shadow hover:shadow-xl">
     <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
       <Gauge className="h-5 w-5 mr-2 text-indigo-600" /> Further Automation Potential
     </h2>
      <div className="w-full bg-gray-200 rounded-full h-4">
         <div className="bg-gradient-to-r from-indigo-400 to-indigo-600 h-4 rounded-full" style={{ width: '60%' }}></div>
      </div>
     <p className="text-sm text-center font-medium text-indigo-700 mt-2">High</p>
     <p className="text-xs text-gray-500 mt-3">Significant opportunities remain for process automation.</p>
   </div>
);

// Placeholder for Sell View
export const MAReadinessScorecard = () => (
   <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition-shadow hover:shadow-xl">
     <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
       <Building className="h-5 w-5 mr-2 text-cyan-600" /> M&A Readiness Score
     </h2>
      <div className="text-center">
         <p className="text-5xl font-bold text-cyan-700 mb-1">B+</p>
         <p className="text-sm text-gray-500">Illustrative score based on current AI maturity & documentation.</p>
      </div>
   </div>
);

export const AIDocumentationChecklist = () => (
   <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition-shadow hover:shadow-xl">
     <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
       <ClipboardCheck className="h-5 w-5 mr-2 text-rose-600" /> AI Documentation Status
     </h2>
     <ul className="space-y-2 text-sm">
       <li className="flex items-center text-gray-700"><Check className="h-4 w-4 mr-2 text-green-500"/> Model Performance Reports</li>
       <li className="flex items-center text-gray-700"><CircleAlert className="h-4 w-4 mr-2 text-amber-500"/> Process Integration Maps</li>
       <li className="flex items-center text-gray-700"><Check className="h-4 w-4 mr-2 text-green-500"/> Data Governance Policy</li>
     </ul>
   </div>
); 