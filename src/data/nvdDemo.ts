import type { NvdCve } from '../types/nvd'

// Dataset demo offline — dipakai saat NVD live tidak terjangkau (offline /
// rate-limit). Bentuk data identik dengan hasil mapping NVD API v2.0.
export const NVD_DEMO_CVES: NvdCve[] = [
  {
    id: 'CVE-2024-3094',
    published: '2024-03-29T17:15:21.150',
    lastModified: '2026-11-04T22:17:21.430',
    description:
      'Malicious code was discovered in the upstream tarballs of xz, starting with version 5.6.0. Through a series of complex obfuscations, the liblzma build process extracts a prebuilt object file from a disguised test file existing in the upstream repository, which is then used to modify specific functions in the liblzma code. This results in a modified liblzma library that can be used by any software linked against this library, intercepting and modifying the data interaction with this library.',
    cvss: { version: '3.1', score: 10.0, severity: 'CRITICAL', vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H' },
    references: [
      { url: 'https://nvd.nist.gov/vuln/detail/CVE-2024-3094', source: 'nvd@nist.gov', tags: ['Third Party Advisory', 'US Government Resource'] },
      { url: 'https://www.openwall.com/lists/oss-security/2024/03/29/4', source: 'secalert@redhat.com', tags: ['Mailing List', 'Third Party Advisory'] },
      { url: 'https://access.redhat.com/security/cve/CVE-2024-3094', source: 'secalert@redhat.com', tags: ['Third Party Advisory'] },
    ],
    weaknesses: ['CWE-506'],
  },
  {
    id: 'CVE-2023-20198',
    published: '2023-10-16T17:15:11.323',
    lastModified: '2026-10-22T14:15:02.110',
    description:
      'Cisco IOS XE Software contains a vulnerability in the web UI feature that could allow an unauthenticated, remote attacker to create an account on an affected system with privilege level 15 access. The attacker can then use that account to gain control of the affected system. This vulnerability is due to insufficient validation of user-supplied input in the web UI.',
    cvss: { version: '3.1', score: 10.0, severity: 'CRITICAL', vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H' },
    references: [
      { url: 'https://nvd.nist.gov/vuln/detail/CVE-2023-20198', source: 'nvd@nist.gov', tags: ['Third Party Advisory', 'US Government Resource'] },
      { url: 'https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-iosxe-webui-privesc-j22SaA4z', source: 'psirt@cisco.com', tags: ['Vendor Advisory'] },
    ],
    weaknesses: ['CWE-287'],
  },
  {
    id: 'CVE-2021-44228',
    published: '2021-12-10T10:15:09.143',
    lastModified: '2026-09-18T09:15:08.220',
    description:
      'Apache Log4j2 2.0-beta9 through 2.15.0 (excluding security releases 2.12.2, 2.12.3, and 2.3.1) JNDI features used in configuration, log messages, and parameters do not protect against attacker-controlled LDAP and other JNDI related endpoints. An attacker who can control log messages or log message parameters can execute arbitrary code loaded from LDAP servers when message lookup substitution is enabled (Log4Shell).',
    cvss: { version: '3.1', score: 10.0, severity: 'CRITICAL', vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H' },
    references: [
      { url: 'https://nvd.nist.gov/vuln/detail/CVE-2021-44228', source: 'nvd@nist.gov', tags: ['Third Party Advisory', 'US Government Resource'] },
      { url: 'https://logging.apache.org/log4j/2.x/security.html', source: 'security@apache.org', tags: ['Vendor Advisory'] },
      { url: 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog', source: 'nvd@nist.gov', tags: ['Third Party Advisory'] },
    ],
    weaknesses: ['CWE-502', 'CWE-400'],
  },
  {
    id: 'CVE-2023-34362',
    published: '2023-06-02T14:15:09.753',
    lastModified: '2026-08-11T16:15:09.003',
    description:
      'In Progress MOVEit Transfer before 2021.0.6, 2021.1.4, 2022.0.4, 2022.1.5, and 2023.0.1, a SQL injection vulnerability has been identified in the MOVEit Transfer web application that could allow an unauthenticated attacker to gain unauthorized access to the MOVEit Transfer database. An attacker could submit a crafted payload to the MOVEit Transfer ISAPI extension that would result in modification or disclosure of MOVEit database content.',
    cvss: { version: '3.1', score: 9.8, severity: 'CRITICAL', vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H' },
    references: [
      { url: 'https://nvd.nist.gov/vuln/detail/CVE-2023-34362', source: 'nvd@nist.gov', tags: ['Third Party Advisory', 'US Government Resource'] },
      { url: 'https://community.progress.com/s/article/MOVEit-Transfer-Critical-Vulnerability-31May2023', source: 'cve@mitre.org', tags: ['Vendor Advisory'] },
    ],
    weaknesses: ['CWE-89'],
  },
  {
    id: 'CVE-2022-22965',
    published: '2022-04-01T10:15:08.303',
    lastModified: '2026-07-02T11:15:07.410',
    description:
      'A Spring MVC or Spring WebFlux application running on JDK 9+ may be vulnerable to remote code execution (RCE) via data binding (Spring4Shell). The specific exploit requires the application to run on Tomcat as a WAR deployment. If the application is deployed as a Spring Boot executable jar, i.e. the default, it is not vulnerable to the exploit. However, the nature of the vulnerability is more general, and there may be other ways to exploit it.',
    cvss: { version: '3.1', score: 9.8, severity: 'CRITICAL', vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H' },
    references: [
      { url: 'https://nvd.nist.gov/vuln/detail/CVE-2022-22965', source: 'nvd@nist.gov', tags: ['Third Party Advisory', 'US Government Resource'] },
      { url: 'https://tanzu.vmware.com/security/cve-2022-22965', source: 'security@vmware.com', tags: ['Vendor Advisory'] },
    ],
    weaknesses: ['CWE-94'],
  },
  {
    id: 'CVE-2023-23397',
    published: '2023-03-14T17:15:11.093',
    lastModified: '2026-06-19T13:15:10.550',
    description:
      'Microsoft Outlook contains an elevation of privilege vulnerability that allows an attacker to send a specially crafted email which triggers automatically when it is retrieved and processed by the Outlook client. This could lead to exploitation of the NTLM relay protocol before the email is even viewed in the Preview Pane, leaking the user Net-NTLMv2 hash to an attacker-controlled SMB server.',
    cvss: { version: '3.1', score: 9.8, severity: 'CRITICAL', vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H' },
    references: [
      { url: 'https://nvd.nist.gov/vuln/detail/CVE-2023-23397', source: 'nvd@nist.gov', tags: ['Third Party Advisory', 'US Government Resource'] },
      { url: 'https://msrc.microsoft.com/update-guide/vulnerability/CVE-2023-23397', source: 'secure@microsoft.com', tags: ['Vendor Advisory'] },
    ],
    weaknesses: ['CWE-294'],
  },
  {
    id: 'CVE-2022-30190',
    published: '2022-05-30T10:15:08.053',
    lastModified: '2026-05-05T10:15:07.900',
    description:
      'Microsoft Windows Support Diagnostic Tool (MSDT) contains a remote code execution vulnerability (Follina) when MSDT is called using the URL protocol from a calling application such as Word. An attacker who successfully exploits this vulnerability can run arbitrary code with the privileges of the calling application, and can then install programs, view, change, or delete data, or create new accounts.',
    cvss: { version: '3.1', score: 7.8, severity: 'HIGH', vector: 'CVSS:3.1/AV:L/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H' },
    references: [
      { url: 'https://nvd.nist.gov/vuln/detail/CVE-2022-30190', source: 'nvd@nist.gov', tags: ['Third Party Advisory', 'US Government Resource'] },
      { url: 'https://msrc.microsoft.com/update-guide/vulnerability/CVE-2022-30190', source: 'secure@microsoft.com', tags: ['Vendor Advisory'] },
    ],
    weaknesses: ['CWE-78'],
  },
  {
    id: 'CVE-2023-44487',
    published: '2023-10-10T14:15:10.863',
    lastModified: '2026-04-28T15:15:09.640',
    description:
      'The HTTP/2 protocol allows a denial of service (server resource consumption) because request cancellation can reset many streams quickly, as exploited in the wild in August through October 2023 (HTTP/2 Rapid Reset Attack). A malicious client can open a large number of streams and immediately cancel them, forcing the server to expend resources processing each reset while keeping the connection alive.',
    cvss: { version: '3.1', score: 7.5, severity: 'HIGH', vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H' },
    references: [
      { url: 'https://nvd.nist.gov/vuln/detail/CVE-2023-44487', source: 'nvd@nist.gov', tags: ['Third Party Advisory', 'US Government Resource'] },
      { url: 'https://www.cisa.gov/news-events/alerts/2023/10/10/http2-rapid-reset-vulnerability-cve-2023-44487', source: 'nvd@nist.gov', tags: ['Third Party Advisory'] },
      { url: 'https://blog.cloudflare.com/technical-breakdown-http2-rapid-reset-ddos-attack/', source: 'cve@mitre.org', tags: ['Technical Description'] },
    ],
    weaknesses: ['CWE-400'],
  },
]