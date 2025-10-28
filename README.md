# hello_IT Support Toolkit

Professional IT Support Automation Scripts

This toolkit provides a collection of PowerShell scripts designed to streamline common IT support tasks, from system diagnostics and network troubleshooting to user management and software installation.

## Features

*   **Comprehensive Diagnostics**: Gather system information, check network connectivity, monitor disk space, and verify Windows Update status.
*   **Network Tools**: Test internet speed, access router configurations, recover WiFi passwords, and enable Remote Desktop.
*   **Administration**: Manage user accounts, configure firewalls, and launch administrative tools.
*   **Utilities**: Manage printers, install software in bulk, perform virus scans, and backup/restore registry settings.
*   **Easy Execution**: Run all tools via a single PowerShell one-liner or an interactive menu.

## Getting Started

### Step 1: Clone the Repository (or download the files)

If you have Git installed, clone the repository:
\`\`\`bash
git clone https://github.com/YOUR_USERNAME/hello-IT-toolkit.git
cd hello-IT-toolkit
\`\`\`

If you don't use Git, download the files and place them in a directory on your machine.

### Step 2: Execute the Toolkit

You can run the toolkit using the interactive menu or directly via a PowerShell one-liner.

**Option A: Interactive Menu**

Navigate to the toolkit's directory in PowerShell and run the menu script:
\`\`\`powershell
.\\menu.ps1
\`\`\`

**Option B: PowerShell One-Liner**

This command downloads and executes the menu script directly from GitHub. Replace \`YOUR_USERNAME\` with your GitHub username and \`main\` with your branch name if different.
\`\`\`powershell
irm https://raw.githubusercontent.com/YOUR_USERNAME/hello-IT-toolkit/main/menu.ps1 | iex
\`\`\`

## Repository Structure

\`\`\`
hello-IT-toolkit/
├── scripts/
│   ├── admin-account-create.ps1
│   ├── admin-account-remove.ps1
│   ├── speed-test.ps1
│   ├── router-access.ps1
│   ├── wifi-recovery.ps1
│   ├── system-info.ps1
│   ├── network-diagnostics.ps1
│   ├── printer-management.ps1
│   ├── firewall-config.ps1
│   ├── disk-monitor.ps1
│   ├── windows-update.ps1
│   ├── rdp-enable.ps1
│   ├── admin-tools-launcher.ps1
│   ├── software-installer.ps1
│   ├── virus-scan.ps1
│   └── registry-backup.ps1
├── menu.ps1
└── README.md
\`\`\`

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your improvements. Ensure your scripts are well-commented and follow standard PowerShell best practices.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
