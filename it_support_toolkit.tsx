import React, { useState, useEffect } from 'react';
import { Monitor, Network, Printer, Shield, Terminal, Database, Download, Copy, Check, Plus, Edit2, Trash2, Search, FileText } from 'lucide-react';

export default function ITSupportToolkit() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [clients, setClients] = useState([]);
  const [scripts, setScripts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddClient, setShowAddClient] = useState(false);
  const [copiedScript, setCopiedScript] = useState(null);
  const [editingClient, setEditingClient] = useState(null);

  useEffect(() => {
    loadClients();
    loadScripts();
  }, []);

  const loadClients = async () => {
    try {
      const keys = await window.storage.list('client:');
      if (keys && keys.keys) {
        const clientData = await Promise.all(
          keys.keys.map(async (key) => {
            try {
              const result = await window.storage.get(key);
              return result ? JSON.parse(result.value) : null;
            } catch {
              return null;
            }
          })
        );
        setClients(clientData.filter(c => c !== null));
      }
    } catch (error) {
      console.log('No clients stored yet');
    }
  };

  const loadScripts = () => {
    const defaultScripts = [
      {
        id: 1,
        name: 'System Info Collector',
        category: 'diagnostics',
        description: 'Collect comprehensive system information',
        script: `# System Information Collector
$computerName = $env:COMPUTERNAME
$os = Get-WmiObject Win32_OperatingSystem
$cpu = Get-WmiObject Win32_Processor
$ram = Get-WmiObject Win32_ComputerSystem

Write-Host "Computer Name: $computerName"
Write-Host "OS: $($os.Caption) $($os.Version)"
Write-Host "CPU: $($cpu.Name)"
Write-Host "RAM: $([math]::Round($ram.TotalPhysicalMemory/1GB,2)) GB"
Write-Host "Last Boot: $($os.ConvertToDateTime($os.LastBootUpTime))"

# Network Info
Get-NetIPAddress | Where-Object {$_.AddressFamily -eq 'IPv4'} | Format-Table`
      },
      {
        id: 2,
        name: 'Network Diagnostics',
        category: 'networking',
        description: 'Test network connectivity and configuration',
        script: `# Network Diagnostics Tool
Write-Host "=== Network Diagnostics ===" -ForegroundColor Green

# Check network adapters
Get-NetAdapter | Select-Object Name, Status, LinkSpeed

# DNS Test
Write-Host "\\nDNS Resolution Test:" -ForegroundColor Yellow
Test-Connection -ComputerName google.com -Count 2

# Check default gateway
$gateway = (Get-NetRoute -DestinationPrefix "0.0.0.0/0").NextHop
Write-Host "\\nDefault Gateway: $gateway"
Test-Connection -ComputerName $gateway -Count 2

# Display DNS servers
Get-DnsClientServerAddress -AddressFamily IPv4`
      },
      {
        id: 3,
        name: 'Printer Management',
        category: 'printing',
        description: 'List and manage printers',
        script: `# Printer Management Script
Write-Host "=== Installed Printers ===" -ForegroundColor Green
Get-Printer | Format-Table Name, DriverName, PortName, PrinterStatus

# Check print spooler service
$spooler = Get-Service -Name Spooler
Write-Host "\\nPrint Spooler Status: $($spooler.Status)" -ForegroundColor Yellow

# Clear print queue (uncomment to use)
# Stop-Service -Name Spooler -Force
# Remove-Item "$env:SystemRoot\\System32\\spool\\PRINTERS\\*" -Force
# Start-Service -Name Spooler`
      },
      {
        id: 4,
        name: 'Firewall Quick Config',
        category: 'security',
        description: 'View and configure Windows Firewall',
        script: `# Firewall Configuration Check
Write-Host "=== Firewall Status ===" -ForegroundColor Green
Get-NetFirewallProfile | Select-Object Name, Enabled

# List active firewall rules (inbound)
Write-Host "\\nActive Inbound Rules:" -ForegroundColor Yellow
Get-NetFirewallRule -Direction Inbound -Enabled True | 
  Select-Object DisplayName, Action | Format-Table

# Example: Add new firewall rule (uncomment to use)
# New-NetFirewallRule -DisplayName "Allow RDP" -Direction Inbound -Protocol TCP -LocalPort 3389 -Action Allow`
      },
      {
        id: 5,
        name: 'Disk Space Monitor',
        category: 'diagnostics',
        description: 'Check disk space on all drives',
        script: `# Disk Space Monitor
Write-Host "=== Disk Space Report ===" -ForegroundColor Green

Get-WmiObject Win32_LogicalDisk -Filter "DriveType=3" | 
  Select-Object DeviceID, 
    @{Name="Size(GB)";Expression={[math]::Round($_.Size/1GB,2)}},
    @{Name="FreeSpace(GB)";Expression={[math]::Round($_.FreeSpace/1GB,2)}},
    @{Name="Used%";Expression={[math]::Round((($_.Size-$_.FreeSpace)/$_.Size)*100,2)}} |
  Format-Table -AutoSize

# Alert if any drive is over 90% full
Get-WmiObject Win32_LogicalDisk -Filter "DriveType=3" | ForEach-Object {
    $percentFree = ($_.FreeSpace / $_.Size) * 100
    if ($percentFree -lt 10) {
        Write-Host "WARNING: Drive $($_.DeviceID) is low on space!" -ForegroundColor Red
    }
}`
      },
      {
        id: 6,
        name: 'Windows Update Check',
        category: 'diagnostics',
        description: 'Check Windows Update status',
        script: `# Windows Update Status
Write-Host "=== Windows Update Status ===" -ForegroundColor Green

# Check Windows Update Service
$wuauserv = Get-Service -Name wuauserv
Write-Host "Windows Update Service: $($wuauserv.Status)"

# Get last update installation
$Session = New-Object -ComObject Microsoft.Update.Session
$Searcher = $Session.CreateUpdateSearcher()
$HistoryCount = $Searcher.GetTotalHistoryCount()
$Updates = $Searcher.QueryHistory(0, 10) | Select-Object Title, Date

Write-Host "\\nRecent Updates:"
$Updates | Format-Table -AutoSize`
      },
      {
        id: 7,
        name: 'Remote Desktop Enable',
        category: 'networking',
        description: 'Enable and configure Remote Desktop',
        script: `# Enable Remote Desktop
Write-Host "=== Remote Desktop Configuration ===" -ForegroundColor Green

# Enable RDP
Set-ItemProperty -Path 'HKLM:\\System\\CurrentControlSet\\Control\\Terminal Server' -Name "fDenyTSConnections" -Value 0

# Enable firewall rule for RDP
Enable-NetFirewallRule -DisplayGroup "Remote Desktop"

# Check RDP status
$rdp = Get-ItemProperty -Path 'HKLM:\\System\\CurrentControlSet\\Control\\Terminal Server' -Name "fDenyTSConnections"
if ($rdp.fDenyTSConnections -eq 0) {
    Write-Host "Remote Desktop is ENABLED" -ForegroundColor Green
} else {
    Write-Host "Remote Desktop is DISABLED" -ForegroundColor Red
}

# Display computer name for connection
Write-Host "\\nConnect using: $env:COMPUTERNAME"`
      },
      {
        id: 8,
        name: 'User Account Manager',
        category: 'security',
        description: 'Manage local user accounts',
        script: `# User Account Management
Write-Host "=== Local User Accounts ===" -ForegroundColor Green

# List all local users
Get-LocalUser | Select-Object Name, Enabled, PasswordRequired, PasswordLastSet | Format-Table

# Example: Create new user (uncomment to use)
# $Password = Read-Host -AsSecureString "Enter password for new user"
# New-LocalUser -Name "NewUser" -Password $Password -FullName "New User" -Description "Created by IT Support"

# Example: Reset password (uncomment to use)
# $NewPassword = Read-Host -AsSecureString "Enter new password"
# Set-LocalUser -Name "Username" -Password $NewPassword`
      }
    ];
    setScripts(defaultScripts);
  };

  const saveClient = async (clientData) => {
    try {
      const client = {
        ...clientData,
        id: clientData.id || `client_${Date.now()}`,
        lastUpdated: new Date().toISOString()
      };
      await window.storage.set(`client:${client.id}`, JSON.stringify(client));
      await loadClients();
      setShowAddClient(false);
      setEditingClient(null);
    } catch (error) {
      alert('Error saving client: ' + error.message);
    }
  };

  const deleteClient = async (clientId) => {
    if (confirm('Are you sure you want to delete this client?')) {
      try {
        await window.storage.delete(`client:${clientId}`);
        await loadClients();
      } catch (error) {
        alert('Error deleting client: ' + error.message);
      }
    }
  };

  const copyToClipboard = (text, scriptId) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(scriptId);
    setTimeout(() => setCopiedScript(null), 2000);
  };

  const downloadScript = (script) => {
    const blob = new Blob([script.script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${script.name.replace(/\s+/g, '_')}.ps1`;
    a.click();
  };

  const filteredClients = clients.filter(client =>
    client.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.pcName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.ipAddress?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredScripts = scripts.filter(script =>
    script.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    script.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-2 rounded-lg">
                <Terminal className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">hello_IT Support Toolkit</h1>
                <p className="text-sm text-slate-400">Professional IT Management Console</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: 'dashboard', icon: Monitor, label: 'Dashboard' },
            { id: 'clients', icon: Database, label: 'Clients' },
            { id: 'scripts', icon: FileText, label: 'PowerShell Scripts' },
            { id: 'tools', icon: Shield, label: 'Quick Tools' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Total Clients</p>
                    <p className="text-3xl font-bold text-white mt-1">{clients.length}</p>
                  </div>
                  <Database className="w-12 h-12 text-blue-500 opacity-50" />
                </div>
              </div>
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">PowerShell Scripts</p>
                    <p className="text-3xl font-bold text-white mt-1">{scripts.length}</p>
                  </div>
                  <FileText className="w-12 h-12 text-green-500 opacity-50" />
                </div>
              </div>
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Quick Actions</p>
                    <p className="text-3xl font-bold text-white mt-1">8</p>
                  </div>
                  <Terminal className="w-12 h-12 text-purple-500 opacity-50" />
                </div>
              </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4">Recent Clients</h3>
              {clients.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No clients added yet. Go to Clients tab to add your first client.</p>
              ) : (
                clients.slice(0, 5).map(client => (
                  <div key={client.id} className="py-3 border-b border-slate-700 last:border-0">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white font-medium">{client.companyName}</p>
                        <p className="text-sm text-slate-400">{client.pcName} • {client.ipAddress}</p>
                      </div>
                      <span className="text-xs text-slate-500">
                        {new Date(client.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => {
                  setEditingClient(null);
                  setShowAddClient(true);
                }}
                className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Client
              </button>
            </div>

            {showAddClient && (
              <ClientForm
                client={editingClient}
                onSave={saveClient}
                onCancel={() => {
                  setShowAddClient(false);
                  setEditingClient(null);
                }}
              />
            )}

            <div className="grid gap-4">
              {filteredClients.map(client => (
                <div key={client.id} className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{client.companyName}</h3>
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                          <p className="text-sm text-slate-400">PC Name</p>
                          <p className="text-white">{client.pcName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">IP Address</p>
                          <p className="text-white">{client.ipAddress}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">Windows Version</p>
                          <p className="text-white">{client.windowsVersion || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">Contact</p>
                          <p className="text-white">{client.contactPerson || 'N/A'}</p>
                        </div>
                      </div>
                      {client.notes && (
                        <div className="mt-3">
                          <p className="text-sm text-slate-400">Notes</p>
                          <p className="text-white text-sm">{client.notes}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingClient(client);
                          setShowAddClient(true);
                        }}
                        className="p-2 text-blue-400 hover:bg-slate-700 rounded-lg"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteClient(client.id)}
                        className="p-2 text-red-400 hover:bg-slate-700 rounded-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'scripts' && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search scripts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid gap-4">
              {filteredScripts.map(script => (
                <div key={script.id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{script.name}</h3>
                        <p className="text-slate-400 text-sm mt-1">{script.description}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                          {script.category}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyToClipboard(script.script, script.id)}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
                          title="Copy to clipboard"
                        >
                          {copiedScript === script.id ? (
                            <Check className="w-5 h-5 text-green-400" />
                          ) : (
                            <Copy className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => downloadScript(script)}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
                          title="Download script"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-lg overflow-x-auto">
                      <pre className="text-sm text-slate-300">
                        <code>{script.script}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Monitor, title: 'Remote Desktop', desc: 'Quick RDP connection', color: 'blue' },
              { icon: Network, title: 'Network Test', desc: 'Ping & traceroute tools', color: 'green' },
              { icon: Printer, title: 'Printer Setup', desc: 'Configure network printers', color: 'purple' },
              { icon: Shield, title: 'Firewall Rules', desc: 'Manage firewall config', color: 'red' },
              { icon: Terminal, title: 'Command Runner', desc: 'Execute remote commands', color: 'yellow' },
              { icon: Database, title: 'Backup Manager', desc: 'Schedule & manage backups', color: 'indigo' }
            ].map((tool, idx) => (
              <div
                key={idx}
                className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-slate-600 transition-all group cursor-pointer"
              >
                <div className={`bg-${tool.color}-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <tool.icon className={`w-6 h-6 text-${tool.color}-400`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{tool.title}</h3>
                <p className="text-sm text-slate-400">{tool.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ClientForm({ client, onSave, onCancel }) {
  const [formData, setFormData] = useState(client || {
    companyName: '',
    pcName: '',
    ipAddress: '',
    windowsVersion: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    notes: ''
  });

  const handleSave = () => {
    if (!formData.companyName || !formData.pcName || !formData.ipAddress) {
      alert('Please fill in required fields: Company Name, PC Name, and IP Address');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
      <h3 className="text-xl font-semibold text-white mb-4">
        {client ? 'Edit Client' : 'Add New Client'}
      </h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Company Name *</label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({...formData, companyName: e.target.value})}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">PC Name *</label>
            <input
              type="text"
              value={formData.pcName}
              onChange={(e) => setFormData({...formData, pcName: e.target.value})}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">IP Address *</label>
            <input
              type="text"
              value={formData.ipAddress}
              onChange={(e) => setFormData({...formData, ipAddress: e.target.value})}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Windows Version</label>
            <input
              type="text"
              value={formData.windowsVersion}
              onChange={(e) => setFormData({...formData, windowsVersion: e.target.value})}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Contact Person</label>
            <input
              type="text"
              value={formData.contactPerson}
              onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Contact Email</label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Contact Phone</label>
            <input
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            rows={3}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Save Client
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}