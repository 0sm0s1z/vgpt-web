import { data } from "~/cve";
import { SeverityGage } from "~/components/SeverityGauge";
import { CvssBox } from "~/components/CvssBox";
import { CpeBox } from "~/components/CpeBox";
import { LongDescription } from "~/components/LongDescription";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { ThreatBar } from "~/components/ThreatBar";
import { ThreatReport } from "~/components/ThreatReport";
import { Remediation } from "~/components/Remediation";
import { References } from "~/components/References";

export interface Cve {
  CVEDataFormat: string;
  CVEDataType: string;
  CVEDataVersion: string;
  CVEDataNumberOfCVEs: string;
  CVEDataTimestamp: string;
  CVEItems: null;
  CVEDataMeta: CVEDataMeta;
  Description: Description;
  Analysis: Analysis;
  CPE: Cpe;
  CVSSV3: Cvssv3;
  References: string[];
  Tags: null;
}

export interface Analysis {
  short_title: string;
  long_description: string;
  short_description: string;
  threat_analysis: string;
  remediation_plan: string;
  tags: string[];
}

export interface Cpe {
  operator: string;
  children: Child[];
}

export interface Child {
  operator: string;
  cpe_match: CpeMatch[];
}

export interface CpeMatch {
  vulnerable: boolean;
  cpe23Uri: string;
}

export interface CVEDataMeta {
  ID: string;
  ASSIGNER: string;
}

export interface Cvssv3 {
  version: string;
  vectorString: string;
  attackVector: string;
  attackComplexity: string;
  privilegesRequired: string;
  userInteraction: string;
  scope: string;
  confidentialityImpact: string;
  integrityImpact: string;
  availabilityImpact: string;
  baseScore: number;
  baseSeverity: string;
}

export interface Description {
  description_data: DescriptionDatum[];
}

export interface DescriptionDatum {
  lang: string;
  value: string;
}

export default function Report() {
  const loading = false;

  return (
    <div className="circuit-board container flex flex-col p-8">
      {loading ? (
        <div className="flex min-h-screen items-center justify-center">
          <h1>
            Loading: <LoadingSpinner />
          </h1>
        </div>
      ) : (
        <div className="flex h-full flex-col gap-2 rounded-xl bg-white/10 p-4 text-white">
          <div className="flex-grow overflow-auto">
            {data.map((cve, index) => (
              <div key={index} className="mb-4 mt-4 w-full rounded-md p-4">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="absolute top-9 h-10 text-violet-100 hover:text-violet-400"
                  >
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </div>
                <h3 className="pb-4 font-orbitron text-2xl font-bold">
                  {cve.CVEDataMeta.ID} - {cve.Analysis.short_title}
                </h3>
                <div className="mb-4 flex w-full flex-row gap-6 rounded-md border border-violet-200/60 bg-white/10 p-4 shadow-lg">
                  <div className="mr-10">
                    <SeverityGage />
                  </div>
                  <CvssBox score={cve.CVSSV3.baseScore} />
                  <CpeBox cve={cve} />
                </div>
                <div className="mb-2 flex flex-row justify-between gap-6">
                  <div className="flex flex-col">
                    <div className="pb-1 font-orbitron text-2xs font-bold uppercase tracking-wider text-violet-100 text-opacity-70">
                      Short Description
                    </div>
                    <div className="font-roboto">
                      <div className="space-y-2 font-roboto">
                        <ReactMarkdown>
                          {cve.Analysis.short_description}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
                <LongDescription cve={cve} />
                <ThreatBar cve={cve} />
                <ThreatReport cve={cve} />
                <Remediation cve={cve} />
                <References cve={cve} />

                <hr className="mt-10"></hr>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export const LoadingSpinner = () => {
  return (
    <svg
      className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      ></path>
    </svg>
  );
};
