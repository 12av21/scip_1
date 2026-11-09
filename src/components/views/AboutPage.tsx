// SCIP Public - About & Responsible AI Charter Page
// Indian Government Digital Portal Standard
import React from 'react';
import { ShieldCheck, Cpu, Users, Lock, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 py-4 text-[#253443]">
      {/* Header */}
      <div className="border-b border-[#DCE3EA] pb-5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#1F5F91] tracking-wider">
          <span className="w-2 h-2 rounded-full bg-[#E89B36]" />
          <span>Governance & Public Accountability Charter</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#153E63] mt-1">
          Smart Community Intelligence Platform (SCIP)
        </h1>
        <p className="text-[#657586] text-sm mt-2 leading-relaxed">
          SCIP is an AI-assisted community intelligence infrastructure designed for public administration. It is NOT simply a passive grievance ticketing system; it actively transforms fragmented community reports into unified municipal decision intelligence.
        </p>
      </div>

      {/* The Responsible AI Principles */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-bold text-[#153E63]">
          <ShieldCheck className="w-5 h-5 text-[#28834A]" />
          <h2>1. Responsible AI Principles & The Three Separation Principles</h2>
        </div>

        <div className="bg-[#EAF2F8] border border-[#DCE3EA] rounded-xl p-6 space-y-3 text-xs leading-relaxed text-[#253443]">
          <div className="font-bold text-sm text-[#153E63]">Non-Autonomous Governance Mandate</div>
          <p className="text-[#657586]">
            Municipal administration directly impacts public safety, emergency services, and taxpayer resources. Therefore, SCIP enforces three inviolable boundaries:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-[#253443]">
            <li>
              <strong>A community report is an observation:</strong> Citizen submissions represent ground-level perceptual reports of symptoms (e.g. "water is stagnant", "drain is overflowing"). They are factual field signals, not administrative conclusions.
            </li>
            <li>
              <strong>An AI-generated incident is an analytical interpretation:</strong> Machine learning algorithms cluster observations, detect spatial overlap, and flag potential root causes. These are mathematical interpretations, not established facts.
            </li>
            <li>
              <strong>An AI recommendation is NOT a final administrative decision:</strong> Public authority officers must review evidence, corroborate physical conditions, and formally confirm incidents before municipal work orders are executed.
            </li>
          </ul>
        </div>
      </section>

      {/* Spatio-Temporal Clustering & NLP Foundation */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-bold text-[#153E63]">
          <Cpu className="w-5 h-5 text-[#1F5F91]" />
          <h2>2. Lightweight & Explainable Intelligence Foundation</h2>
        </div>
        <p className="text-xs text-[#657586] leading-relaxed">
          SCIP does not rely blindly on opaque third-party AI APIs. It runs an explainable, self-contained machine learning pipeline:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-5 rounded-xl bg-white border border-[#DCE3EA] shadow-xs space-y-2">
            <div className="font-bold text-[#153E63]">TF-IDF Vector Space & Classification</div>
            <p className="text-[#657586] leading-relaxed">
              Extracts unigram and bigram features after domain stopword pruning and stemming. Maps observations into high-dimensional vector space and scores against municipal category centroids with calibrated confidence.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-[#DCE3EA] shadow-xs space-y-2">
            <div className="font-bold text-[#153E63]">Spatio-Temporal DBSCAN Clustering</div>
            <p className="text-[#657586] leading-relaxed">
              Combines great-circle Haversine geospatial proximity (within 500m), temporal proximity (within 48 hours), and semantic text similarity to group related reports into <em>Potential Incidents</em>.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-[#DCE3EA] shadow-xs space-y-2">
            <div className="font-bold text-[#153E63]">Explainable Multi-Factor Risk Scoring</div>
            <p className="text-[#657586] leading-relaxed">
              Produces a transparent 0-100 risk score and priority rank (P1-P4) by decomposing inherent physical hazards, community report density, public infrastructure impact, and historical area recurrence.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-[#DCE3EA] shadow-xs space-y-2">
            <div className="font-bold text-[#153E63]">SCIP Multi-Tool Agent Orchestration</div>
            <p className="text-[#657586] leading-relaxed">
              A 10-tool agent capable of executing classification, entity extraction, duplicate detection, geospatial radius density, cluster detection, recurrence analysis, and decision briefings.
            </p>
          </div>
        </div>
      </section>

      {/* Role-Based Access Control Architecture */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-bold text-[#153E63]">
          <Users className="w-5 h-5 text-[#1F5F91]" />
          <h2>3. Role-Based Access Control (RBAC)</h2>
        </div>
        <div className="overflow-hidden border border-[#DCE3EA] rounded-xl bg-white shadow-xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#153E63] text-white font-semibold">
              <tr>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Primary User Persona</th>
                <th className="p-3.5">Key Permitted Capabilities</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE3EA] text-[#253443]">
              <tr className="hover:bg-[#F5F7FA]">
                <td className="p-3.5 font-bold text-[#1F5F91]">Citizen</td>
                <td className="p-3.5">Residents, neighborhood shop owners, commuters</td>
                <td className="p-3.5 text-[#657586]">Submit observations, track status, view local incidents, submit resolution feedback</td>
              </tr>
              <tr className="hover:bg-[#F5F7FA]">
                <td className="p-3.5 font-bold text-[#1F5F91]">Officer</td>
                <td className="p-3.5">Field engineers, departmental supervisors (PWD, Water, Grid)</td>
                <td className="p-3.5 text-[#657586]">Investigate reports, review clusters, record field resolutions, manage assignments</td>
              </tr>
              <tr className="hover:bg-[#F5F7FA]">
                <td className="p-3.5 font-bold text-[#1F5F91]">Authority</td>
                <td className="p-3.5">Municipal commissioners, operational directors, superintendents</td>
                <td className="p-3.5 text-[#657586]">Confirm/dismiss potential incidents, assign departments, access intelligence analytics</td>
              </tr>
              <tr className="hover:bg-[#F5F7FA]">
                <td className="p-3.5 font-bold text-[#1F5F91]">Admin</td>
                <td className="p-3.5">System administrators, compliance officers</td>
                <td className="p-3.5 text-[#657586]">User management, department settings, audit logs, system security events, test suite</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Citizen Charter & SLA */}
      <section className="bg-[#F5F7FA] border border-[#DCE3EA] rounded-xl p-6 space-y-3">
        <h3 className="font-bold text-[#153E63] text-sm">Citizen Service Level Commitments (SLA)</h3>
        <p className="text-xs text-[#657586] leading-relaxed">
          The Municipal Corporation pledges acknowledgement of all community observations within 15 minutes of intake. Category classification and duplicate proximity detection are processed immediately by the SCIP pipeline. Critical physical hazards (P1) are dispatched for field review within 24 hours.
        </p>
      </section>
    </div>
  );
};
