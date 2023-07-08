import { Cve } from "~/pages/report";

interface ThreatBarProps {
  cve: Cve;
}

export const ThreatBar = ({ cve }: ThreatBarProps) => {
  const summary = threatSummary(cve);
  return (
    <div className="mt-4 flex w-full flex-row gap-6 rounded-md border border-violet-200/60 bg-white/10 p-8 shadow-lg">
      <div className="flex flex-row">
        <div className="flex flex-col">
          <div className="w-20 pb-1 font-orbitron text-2xs font-bold uppercase tracking-wider text-violet-100 text-opacity-70">
            Badges
          </div>
          <div className="border-r border-r-violet-300 font-roboto">
            <div>KEV</div> <div>MSF</div> <div>eDB</div>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col">
        <div className="flex w-full flex-row items-center justify-between px-2 font-roboto">
          <div className="flex flex-col">
            <div className="pb-1 font-orbitron text-2xs font-bold uppercase tracking-wider text-violet-100 text-opacity-70">
              Attack Vector
            </div>
            <div className="font-roboto text-violet-100">
              {cve.CVSSV3?.attackVector}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="pb-1 font-orbitron text-2xs font-bold uppercase tracking-wider text-violet-100 text-opacity-70">
              Attack Complexity
            </div>
            <div className="font-roboto text-violet-100">
              {cve.CVSSV3?.attackComplexity}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="pb-1 font-orbitron text-2xs font-bold uppercase tracking-wider text-violet-100 text-opacity-70">
              PrivilegesRequired
            </div>
            <div className="font-roboto text-violet-100">
              {cve.CVSSV3?.privilegesRequired}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="pb-1 font-orbitron text-2xs font-bold uppercase tracking-wider text-violet-100 text-opacity-70">
              User Interaction
            </div>
            <div className="font-roboto text-violet-100">
              {cve.CVSSV3?.userInteraction}
            </div>
          </div>
        </div>
        <div className="mt-4 font-orbitron text-2xs font-bold uppercase tracking-wider text-violet-100">
          <div className="flex flex-row items-center">
            <div className="flex flex-col ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1"
                stroke="currentColor"
                className="mr-4 w-10 text-violet-100 shadow-md"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            <div className="flex flex-col">{summary}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

//Threat Summary Builder
// * Salutation -> number of factors yields increased risk

const threatSummary = (cve: Cve) => {
  const summary = [];
  summary.push("");

  const badges = cve.Analysis.tags;
  // * Exploit Code Maturity
  if (badges && badges.length > 0) {
    for (let i = 0; i < badges.length; i++) {
      summary.push(
        `Exploit code is available for this vulnerability decreasing the capability required for weaponization and thereby increasing likelihood of employment. `
      );
      if (badges[i] === "msf") {
        summary.push(
          `This vulnerability has a Metasploit module available for it enabling simple implementation. `
        );
      } else if (badges[i] === "kev") {
        summary.push(
          `An entry exists in the CISA Known Exploited Vulnerabilities catalog for this condition. `
        );
      }
    }
  }
  // * CVSS Factors -> Read from vector string
  console.log(cve.CVSSV3.vectorString);


const AV = "";
const AC = "";
const PR = "";
const UI = "";
const S = "";
const C = "";
const I = "";
const A = ""; 


  // Parse vector string
  if (cve.CVSSV3) {
    const vector = cve.CVSSV3.vectorString.split("/");
    const AV = vector[0].split(":")[1];
    const AC = vector[1].split(":")[1];
    const PR = vector[2].split(":")[1];
    const UI = vector[3].split(":")[1];
    const S = vector[4].split(":")[1];
    const C = vector[5].split(":")[1];
    const I = vector[6].split(":")[1];
    const A = vector[7].split(":")[1];
  }

  // * Attack Vector
  if (AV === "N") {
    summary.push(`This vulnerability is remotely exploitable. `);
  } else if (AV === "A") {
    summary.push(
      `This vulnerability is remotely exploitable from an adjacent network. `
    );
  } else if (AV === "L") {
    summary.push(`This vulnerability is locally exploitable. `);
  } else if (AV === "P") {
    summary.push(
      `This vulnerability is only exploitable by a physical attacker. `
    );
  }
  // * Attack Complexity
  if (AC === "L") {
    summary.push(`This vulnerability is trivial for an attacker to exploit. `);
  } else if (AC === "H") {
    summary.push(`Exploitation of this vulnerability may prove challenging. `);
  }
  // * Privileges Required
  if (PR === "N") {
    summary.push(
      `This vulnerability does not require any special privileges to exploit. `
    );
  } else if (PR === "L") {
    summary.push(`Only low level access is required. `);
  } else if (PR === "H") {
    summary.push(
      `An elevated level of access is required to exploit this issue. `
    );
  }
  // * User Interaction
  if (UI === "N") {
    summary.push(`No user interaction is necessary. `);
  } else if (UI === "R") {
    summary.push(
      `A user must interact with the system to trigger the exploit payload. `
    );
  }

  return summary;
};
