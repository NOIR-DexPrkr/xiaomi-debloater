import { useState, useEffect, type CSSProperties } from 'react'
import { GetDevices, GetPackages, GetDeviceInfo, CheckADB, GetListInfo, UpdateList } from '../wailsjs/go/main/App.js'
import { Environment } from '../wailsjs/runtime/runtime.js'
import { main } from '../wailsjs/go/models.js'

type Device = main.Device
type AppPackage = main.AppPackage

interface LogEntry {
  Timestamp: string
  Package: string
  Message: string
  Success: boolean
}
import Sidebar from './components/Sidebar'
import Settings from './components/Settings'
import DeviceHeader from './components/DeviceHeader'
import FilterBar from './components/FilterBar'
import PackageList from './components/PackageList'
import LogPanel from './components/LogPanel'
import Guide from './components/Guide'
import Home from './components/Home'

type AppView = 'home' | 'debloat' | 'guide' | 'settings'
type PackageMode = 'disable' | 'uninstall'

// The Debloater splits into two full-width tabs: freeze apps or uninstall them
const MODE_TABS: { value: PackageMode; label: string; description: string }[] = [
  { value: 'disable', label: 'Deshabilitar', description: 'Apps que se pueden congelar o reactivar' },
  { value: 'uninstall', label: 'Desinstalar', description: 'Incluye apps del sistema' },
]

function App() {
  const [devices, setDevices] = useState<Device[]>([])
  const [selectedSerial, setSelectedSerial] = useState<string>('')
  const [packages, setPackages] = useState<AppPackage[]>([])
  const [deviceInfo, setDeviceInfo] = useState<Record<string, string>>({})
  const [logEntries, setLogEntries] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [packageMode, setPackageMode] = useState<PackageMode>('disable')
  const [view, setView] = useState<AppView>('home')
  const [isMac, setIsMac] = useState(false)
  // Operation log: hidden by default, auto-opens on the first action
  const [logOpen, setLogOpen] = useState(false)
  // ADB status, shared by the sidebar footer and the settings view
  const [adbState, setAdbState] = useState<'checking' | 'installed' | 'missing'>('checking')
  const [adbVersion, setAdbVersion] = useState('')
  // Package list info (Settings)
  const [listInfo, setListInfo] = useState<main.ListInfo | null>(null)
  const [listStatus, setListStatus] = useState('')
  // Advanced users can reveal risk=danger packages; everyone else never sees them
  const [showDanger, setShowDanger] = useState(
    () => localStorage.getItem('xiaomi-debloater.show-danger') === 'true'
  )
  // Bumped when a newer package list is downloaded so packages get re-classified
  const [listRevision, setListRevision] = useState(0)

  // Fetch connected devices
  const refreshDevices = async () => {
    try {
      const devs = (await GetDevices()) ?? []
      setDevices(devs)
      // Keep the current selection while it is still connected; otherwise pick the first ready device.
      // Functional update avoids the stale selectedSerial captured by the polling interval.
      setSelectedSerial((prev) => {
        if (prev && devs.some((d) => d.serial === prev)) return prev
        const ready = devs.find((d) => d.state === 'device')
        return ready ? ready.serial : ''
      })
    } catch (err) {
      addLog('', `No se pudieron obtener los dispositivos: ${err}`, false)
    }
  }

  // Fetch packages for selected device
  const refreshPackages = async () => {
    if (!selectedSerial) return

    setLoading(true)
    try {
      const pkgs = (await GetPackages(selectedSerial)) ?? []
      setPackages(pkgs)
      addLog('', 'Paquetes actualizados', true)
    } catch (err) {
      addLog('', `No se pudieron obtener los paquetes: ${err}`, false)
    } finally {
      setLoading(false)
    }
  }

  // Fetch device info
  const loadDeviceInfo = async () => {
    if (!selectedSerial) return

    try {
      const info = await GetDeviceInfo(selectedSerial)
      setDeviceInfo(info)
    } catch (err) {
      addLog('', `No se pudo obtener la información del dispositivo: ${err}`, false)
    }
  }

  // Add log entry
  const addLog = (packageName: string, message: string, success: boolean) => {
    const entry: LogEntry = {
      Timestamp: new Date().toLocaleTimeString(),
      Package: packageName,
      Message: message,
      Success: success,
    }
    setLogEntries((prev) => [...prev, entry])
  }

  // Clear log
  const clearLog = () => {
    setLogEntries([])
  }

  const checkAdb = async () => {
    setAdbState('checking')
    try {
      const version = await CheckADB()
      setAdbVersion(version.split('\n')[0])
      setAdbState('installed')
    } catch {
      setAdbVersion('')
      setAdbState('missing')
    }
  }

  // Pull the latest package list (and its status for Settings) at startup
  const updateList = async () => {
    setListStatus('Comprobando…')
    try {
      const before = (listInfo ?? (await GetListInfo())).version
      const info = await UpdateList()
      setListInfo(info)
      if (info.version !== before) {
        setListStatus('Actualizada')
        setListRevision((r) => r + 1)
      } else {
        setListStatus('Ya está al día')
      }
    } catch (err) {
      setListStatus('Error al actualizar')
      console.error(err)
    }
  }

  // Initial device detection
  useEffect(() => {
    refreshDevices()
    const interval = setInterval(refreshDevices, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    checkAdb()
    GetListInfo().then(setListInfo)
    updateList()
    Environment()
      .then((env) => setIsMac(env.platform === 'darwin'))
      .catch(() => setIsMac(false))
  }, [])

  // Load packages and device info when device changes
  useEffect(() => {
    if (selectedSerial) {
      loadDeviceInfo()
      refreshPackages()
    } else {
      setPackages([])
      setDeviceInfo({})
    }
  }, [selectedSerial, listRevision])

  // A state filter (Deshabilitadas/Eliminadas) belongs to one mode only
  useEffect(() => {
    if (
      (packageMode === 'disable' && activeCategory === 'Removed') ||
      (packageMode === 'uninstall' && activeCategory === 'Disabled')
    ) {
      setActiveCategory('All')
    }
  }, [packageMode, activeCategory])

  const connectedCount = devices.filter((d) => d.state === 'device').length

  // The log opens itself the first time an action runs
  const handleActionStart = () => setLogOpen(true)

  if (view === 'home') {
    return (
      <div className="dark bg-noir text-noir-text h-screen flex flex-col">
        {/* Home navbar: brand + window drag handle */}
        <div
          className={`flex items-center border-b border-noir-border bg-noir px-4 ${isMac ? 'h-13 pl-24' : 'h-12'}`}
          style={{ '--wails-draggable': 'drag' } as CSSProperties}
        >
          <span className="flex items-center gap-2 select-none">
            <span className="font-display font-black text-sm tracking-[-0.03em] uppercase">
              NOIR<span className="text-noir-cyan">XD</span>
            </span>
            <span className="text-noir-muted text-xs">Noir - Xiaomi Debloater</span>
          </span>
        </div>
        <Home onStart={() => setView('debloat')} onGuide={() => setView('guide')} />
      </div>
    )
  }

  return (
    <div className="dark bg-noir text-noir-text h-screen flex overflow-hidden">
      {/* Sidebar navigation */}
      <Sidebar
        view={view}
        onNavigate={setView}
        isMac={isMac}
        devicesConnected={connectedCount}
        adbOk={adbState === 'installed'}
      />

      {/* Main area */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {view === 'debloat' ? (
          <>
            {/* Header */}
            <div className="border-b border-noir-border p-4">
              <DeviceHeader
                devices={devices}
                selectedSerial={selectedSerial}
                onSelectDevice={setSelectedSerial}
                deviceInfo={deviceInfo}
                onRefresh={() => {
                  refreshDevices()
                  refreshPackages()
                }}
                isLoading={loading}
              />
            </div>

            {/* Action mode tabs: full width, right below the device info */}
            <div className="flex border-b border-noir-border bg-noir">
              {MODE_TABS.map((tab, index) => (
                <button
                  key={tab.value}
                  onClick={() => setPackageMode(tab.value)}
                  aria-pressed={packageMode === tab.value}
                  className={`flex-1 min-w-0 px-4 py-2.5 text-left border-t-2 transition-colors ${
                    index > 0 ? 'border-l border-noir-border' : ''
                  } ${
                    packageMode === tab.value
                      ? 'bg-noir-accent border-t-noir-cyan text-noir-cyan'
                      : 'border-t-transparent text-noir-body hover:bg-noir-hover hover:text-noir-text'
                  }`}
                >
                  <span className="block font-display font-bold text-xs uppercase tracking-[0.08em]">
                    {tab.label}
                  </span>
                  <span className="block text-[11px] opacity-75 truncate">{tab.description}</span>
                </button>
              ))}
            </div>

            {/* Filter Bar */}
            <div className="border-b border-noir-border p-3">
              <FilterBar
                searchText={searchText}
                activeCategory={activeCategory}
                mode={packageMode}
                onSearchChange={setSearchText}
                onCategoryChange={setActiveCategory}
              />
            </div>

            {/* Package List */}
            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
              <PackageList
                packages={packages}
                searchText={searchText}
                activeCategory={activeCategory}
                selectedSerial={selectedSerial}
                mode={packageMode}
                showDanger={showDanger}
                onAddLog={addLog}
                onRefresh={refreshPackages}
                onActionStart={handleActionStart}
                isLoading={loading}
              />
            </div>

            {/* Operation log: only here, collapsed by default */}
            <LogPanel
              entries={logEntries}
              onClear={clearLog}
              open={logOpen}
              onToggle={() => setLogOpen((o) => !o)}
            />
          </>
        ) : view === 'guide' ? (
          <div className="flex-1 overflow-y-auto">
            <Guide />
          </div>
        ) : (
          <Settings
            adbState={adbState}
            adbVersion={adbVersion}
            onRecheckAdb={checkAdb}
            listInfo={listInfo}
            listStatus={listStatus}
            onUpdateList={updateList}
            showDanger={showDanger}
            onToggleDanger={() =>
              setShowDanger((prev) => {
                localStorage.setItem('xiaomi-debloater.show-danger', String(!prev))
                return !prev
              })
            }
            devices={devices}
          />
        )}
      </main>
    </div>
  )
}

export default App
