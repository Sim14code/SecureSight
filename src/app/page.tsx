"use client";
import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Camera as CameraIcon,
  MapPin,
  AlertTriangle,
  Users,
  ChevronDown,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Shield,
  Target,
  Eye,
  Clock,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";

const ICONS = {
  "Unauthorized Access": Shield,
  "Gun Threat": Target,
};

type CameraType = {
  id: number;
  name: string;
  status: string;
};

type IncidentType = {
  id: number;
  type: string;
  camera: { id: number; name: string; location: string };
  tsStart: string;
  tsEnd: string;
  thumbnailUrl: string;
  resolved: boolean;
};

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: CameraIcon, label: "Cameras" },
  { icon: MapPin, label: "Scenes" },
  { icon: AlertTriangle, label: "Incidents" },
  { icon: Users, label: "Users" },
];

const SecurityDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeCamera, setActiveCamera] = useState("");
  const [isPlaying, setIsPlaying] = useState(true);
  const [incidents, setIncidents] = useState<IncidentType[]>([]);
  const [cameras, setCameras] = useState<CameraType[]>([]);
  const [fadingIncidents, setFadingIncidents] = useState<number[]>([]);
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [resolvedIncidents, setResolvedIncidents] = useState<IncidentType[]>(
    []
  );

  const [mounted, setMounted] = useState(false); // Add this

  useEffect(() => {
    setMounted(true); // Set mounted to true after client mount
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch incidents and cameras
  useEffect(() => {
    fetch("/api/incidents?resolved=false")
      .then((res) => res.json())
      .then((data) => {
        setIncidents(data);
        if (data.length > 0 && !activeCamera) {
          setActiveCamera(data[0].camera.name);
        }
      });
    // Fetch resolved incidents
    fetch("/api/incidents?resolved=true")
      .then((res) => res.json())
      .then((data) => {
        setResolvedIncidents(data);
      });
    // Fetch cameras (from incidents for now)
    fetch("/api/incidents")
      .then((res) => res.json())
      .then((data) => {
        const uniqueCams = Array.from(
          new Set<string>(data.map((i: IncidentType) => i.camera.name))
        ).map((name) => {
          const cam = data.find((i: IncidentType) => i.camera.name === name);
          return { id: cam.camera.id, name: cam.camera.name, status: "active" };
        });
        setCameras(uniqueCams);
      });
  }, [activeCamera]);

  const handleResolve = async (id: number) => {
    setFadingIncidents((prev) => [...prev, id]);
    setTimeout(async () => {
      await fetch(`/api/incidents/${id}/resolve`, { method: "PATCH" });
      setIncidents((prev) => prev.filter((i) => i.id !== id));
      setFadingIncidents((prev) => prev.filter((fid) => fid !== id));
      fetch("/api/incidents?resolved=true")
        .then((res) => res.json())
        .then((data) => setResolvedIncidents(data));
    }, 400);
  };

  const NavItem = ({
    icon: Icon,
    label,
    active = false,
    onClick,
  }: {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    label: string;
    active?: boolean;
    onClick?: () => void;
  }) => (
    <div
      className={`flex items-center px-4 py-3 cursor-pointer transition-all duration-200 ${
        active
          ? "bg-blue-600 text-white border-r-2 border-blue-400"
          : "text-blue-200 hover:bg-blue-700 hover:text-white"
      }`}
      onClick={onClick}
    >
      <Icon size={20} className="mr-3" />
      <span className="font-medium">{label}</span>
    </div>
  );

  const IncidentCard = ({ incident }: { incident: IncidentType }) => {
    const IconComponent: React.ComponentType<{
      size?: number;
      className?: string;
    }> = ICONS[incident.type as keyof typeof ICONS] ?? Eye;
    const isFading = fadingIncidents.includes(incident.id);
    return (
      <div
        className={`bg-gray-800 rounded-lg p-4 mb-3 border-l-4 border-orange-500 transition-opacity duration-300 ${
          isFading ? "opacity-30" : "opacity-100"
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Image
              src={incident.thumbnailUrl || "/file.svg"}
              alt="Incident thumbnail"
              width={60}
              height={40}
              className="rounded object-cover"
            />
            <div>
              <div className="flex items-center space-x-2">
                <div className="bg-orange-500 p-2 rounded-lg">
                  <IconComponent size={16} className="text-white" />
                </div>
                <h4 className="text-orange-400 font-semibold text-sm">
                  {incident.type}
                </h4>
              </div>
              <p className="text-gray-300 text-xs mt-1">
                {incident.camera.name}
              </p>
              <p className="text-gray-400 text-xs mt-1 flex items-center">
                <Clock size={12} className="mr-1" />
                {formatIncidentTime(incident.tsStart, incident.tsEnd)}
              </p>
            </div>
          </div>
          <button
            className="text-yellow-400 text-sm font-medium hover:text-yellow-300"
            onClick={() => handleResolve(incident.id)}
            disabled={isFading}
          >
            Resolve →
          </button>
        </div>
      </div>
    );
  };

  function formatIncidentTime(tsStart: string, tsEnd: string) {
    const start = new Date(tsStart);
    const end = new Date(tsEnd);
    return `${start.getHours()}:${start
      .getMinutes()
      .toString()
      .padStart(2, "0")} - ${end.getHours()}:${end
      .getMinutes()
      .toString()
      .padStart(2, "0")} on ${start.getDate()}-${start.toLocaleString(
      "default",
      { month: "short" }
    )}-${start.getFullYear()}`;
  }

  // Helper to get a video URL for a camera name (demo)
  function getCameraVideoUrl(cameraName: string) {
    // Map camera names to sample video URLs (replace with real URLs as needed)
    if (cameraName.includes("Shop Floor")) return "/sample1.mp4";
    if (cameraName.includes("Vault")) return "/sample2.mp4";
    if (cameraName.includes("Entrance")) return "/sample3.mp4";
    if (cameraName.includes("Back Alley")) return "/sample4.mp4";
    return "";
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <header className="bg-blue-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 p-2 rounded">
            <Shield size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold">MANDLACX</h1>
        </div>
        <nav className="flex items-center space-x-6">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              active={activeSection === item.label}
              onClick={() => setActiveSection(item.label)}
            />
          ))}
        </nav>
        <div className="flex items-center space-x-3">
          <div className="text-sm text-blue-200">
            {mounted ? currentTime.toLocaleTimeString() : "--:--:--"}
          </div>
          <div className="flex items-center space-x-2 bg-blue-700 px-3 py-2 rounded-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Users size={16} />
            </div>
            <div>
              <div className="text-sm font-medium">Mohammed Ajhas</div>
              <div className="text-xs text-blue-200">ajhas@mandlacx.com</div>
            </div>
            <ChevronDown size={16} className="text-blue-200" />
          </div>
        </div>
      </header>
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeSection === "Dashboard" && (
            <div className="bg-gray-800 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-400">
                  📅 11/7/2025 - 03:12:37
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition-colors"
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-colors">
                    <RotateCcw size={16} />
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-colors">
                    <Maximize2 size={16} />
                  </button>
                </div>
              </div>
              <div className="relative">
                {/* Main Camera Feed */}
                <div className="bg-gray-700 rounded-lg aspect-video relative overflow-hidden mb-4 flex items-center justify-center">
                  {getCameraVideoUrl(activeCamera) ? (
                    <video
                      src={getCameraVideoUrl(activeCamera)}
                      controls
                      autoPlay
                      loop
                      muted
                      className="w-full h-full object-cover rounded-lg"
                      style={{ maxHeight: "400px", background: "#222" }}
                    />
                  ) : (
                    <Image
                      src="/globe.svg"
                      alt="Main Camera"
                      fill
                      style={{ objectFit: "cover", opacity: 0.7 }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-gray-900/40"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <CameraIcon
                        size={48}
                        className="mx-auto mb-4 text-gray-400"
                      />
                      <div className="text-4xl font-bold text-white mb-2">
                        MANDATORY
                      </div>
                      <div className="text-lg text-gray-300">
                        Live Feed - {activeCamera}
                      </div>
                    </div>
                  </div>
                  {/* Camera Label */}
                  <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-1 rounded text-sm">
                    📹 {activeCamera}
                  </div>
                  {/* Recording Indicator */}
                  {isPlaying && (
                    <div className="absolute top-4 right-4 flex items-center space-x-2 bg-red-600 px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">LIVE</span>
                    </div>
                  )}
                </div>
                {/* Mini Camera Strip */}
                <div className="flex gap-3 mb-4">
                  {cameras
                    .filter((cam) => cam.name !== activeCamera)
                    .slice(0, 2)
                    .map((camera) => (
                      <div
                        key={camera.id}
                        className="relative w-24 h-16 rounded overflow-hidden border-2 border-gray-700"
                      >
                        <Image
                          src="/vercel.svg"
                          alt={camera.name}
                          fill
                          style={{ objectFit: "cover", opacity: 0.8 }}
                        />
                        <div className="absolute bottom-1 left-1 bg-black/70 px-2 py-0.5 rounded text-xs">
                          {camera.name}
                        </div>
                      </div>
                    ))}
                </div>
                {/* Camera Grid */}
                <div className="grid grid-cols-4 gap-3">
                  {cameras.map((camera) => (
                    <div
                      key={camera.id}
                      className={`bg-gray-700 rounded-lg aspect-video relative cursor-pointer transition-all duration-200 ${
                        activeCamera === camera.name
                          ? "ring-2 ring-blue-500"
                          : "hover:bg-gray-600"
                      }`}
                      onClick={() => setActiveCamera(camera.name)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg"></div>
                      <div className="absolute bottom-2 left-2 text-xs bg-black/70 px-2 py-1 rounded">
                        {camera.name}
                      </div>
                      <div className="absolute top-2 right-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            camera.status === "active"
                              ? "bg-green-400"
                              : "bg-red-400"
                          }`}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeSection === "Cameras" && (
            <div className="bg-gray-800 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-400">
                  📅 11/7/2025 - 03:12:37
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition-colors"
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-colors">
                    <RotateCcw size={16} />
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-colors">
                    <Maximize2 size={16} />
                  </button>
                </div>
              </div>
              <div className="relative">
                {/* Main Camera Feed */}
                <div className="bg-gray-700 rounded-lg aspect-video relative overflow-hidden mb-4 flex items-center justify-center">
                  {getCameraVideoUrl(activeCamera) ? (
                    <video
                      src={getCameraVideoUrl(activeCamera)}
                      controls
                      autoPlay
                      loop
                      muted
                      className="w-full h-full object-cover rounded-lg"
                      style={{ maxHeight: "400px", background: "#222" }}
                    />
                  ) : (
                    <Image
                      src="/globe.svg"
                      alt="Main Camera"
                      fill
                      style={{ objectFit: "cover", opacity: 0.7 }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-gray-900/40"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <CameraIcon
                        size={48}
                        className="mx-auto mb-4 text-gray-400"
                      />
                      <div className="text-4xl font-bold text-white mb-2">
                        MANDATORY
                      </div>
                      <div className="text-lg text-gray-300">
                        Live Feed - {activeCamera}
                      </div>
                    </div>
                  </div>
                  {/* Camera Label */}
                  <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-1 rounded text-sm">
                    📹 {activeCamera}
                  </div>
                  {/* Recording Indicator */}
                  {isPlaying && (
                    <div className="absolute top-4 right-4 flex items-center space-x-2 bg-red-600 px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">LIVE</span>
                    </div>
                  )}
                </div>
                {/* Mini Camera Strip */}
                <div className="flex gap-3 mb-4">
                  {cameras
                    .filter((cam) => cam.name !== activeCamera)
                    .slice(0, 2)
                    .map((camera) => (
                      <div
                        key={camera.id}
                        className="relative w-24 h-16 rounded overflow-hidden border-2 border-gray-700"
                      >
                        <Image
                          src="/vercel.svg"
                          alt={camera.name}
                          fill
                          style={{ objectFit: "cover", opacity: 0.8 }}
                        />
                        <div className="absolute bottom-1 left-1 bg-black/70 px-2 py-0.5 rounded text-xs">
                          {camera.name}
                        </div>
                      </div>
                    ))}
                </div>
                {/* Camera Grid */}
                <div className="grid grid-cols-4 gap-3">
                  {cameras.map((camera) => (
                    <div
                      key={camera.id}
                      className={`bg-gray-700 rounded-lg aspect-video relative cursor-pointer transition-all duration-200 ${
                        activeCamera === camera.name
                          ? "ring-2 ring-blue-500"
                          : "hover:bg-gray-600"
                      }`}
                      onClick={() => setActiveCamera(camera.name)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg"></div>
                      <div className="absolute bottom-2 left-2 text-xs bg-black/70 px-2 py-1 rounded">
                        {camera.name}
                      </div>
                      <div className="absolute top-2 right-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            camera.status === "active"
                              ? "bg-green-400"
                              : "bg-red-400"
                          }`}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeSection === "Scenes" && (
            <div className="bg-gray-800 rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Scenes</h2>
              <p className="text-gray-300">Scene management coming soon.</p>
            </div>
          )}
          {activeSection === "Incidents" && (
            <div className="bg-gray-800 rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Incidents</h2>
              <div className="space-y-3">
                {incidents.map((incident) => (
                  <IncidentCard key={incident.id} incident={incident} />
                ))}
              </div>
            </div>
          )}
          {activeSection === "Users" && (
            <div className="bg-gray-800 rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Users</h2>
              <p className="text-gray-300">User management coming soon.</p>
            </div>
          )}
        </div>
        {/* Incidents Sidebar */}
        <div className="w-96 bg-gray-800 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <AlertTriangle className="mr-2 text-red-500" size={20} />
                {incidents.length} Unresolved Incidents
              </h2>
              <div className="flex items-center text-sm text-green-400">
                <CheckCircle size={16} className="mr-1" />
                {resolvedIncidents.length} resolved incidents
              </div>
            </div>
            <div className="space-y-3">
              {incidents.map((incident) => (
                <IncidentCard key={incident.id} incident={incident} />
              ))}
            </div>
            <div className="mt-8">
              <h3 className="text-md font-semibold mb-2 text-green-400 flex items-center">
                <CheckCircle size={16} className="mr-1" />
                Resolved
              </h3>
              <div className="space-y-3">
                {resolvedIncidents.map((incident) => (
                  <IncidentCard key={incident.id} incident={incident} />
                ))}
              </div>
            </div>
          </div>
          {/* Quick Stats */}
          <div className="border-t border-gray-700 pt-6">
            <h3 className="font-semibold mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Active Cameras</span>
                <span className="text-green-400 font-semibold">
                  {cameras.length}/{cameras.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">System Health</span>
                <span className="text-green-400 font-semibold">Optimal</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Storage Usage</span>
                <span className="text-yellow-400 font-semibold">67%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Network Status</span>
                <span className="text-green-400 font-semibold">Connected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function Card({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="bg-white rounded shadow border" {...props}>
      {children}
    </div>
  );
}

export function CardContent({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props}>{children}</div>;
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline";
};

export function Button({
  variant = "default",
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "px-4 py-2 rounded font-semibold transition " +
    (variant === "outline"
      ? "border border-gray-400 bg-transparent text-gray-800"
      : "bg-blue-600 text-white hover:bg-blue-700");
  return <button className={`${base} ${className}`} {...props} />;
}

export default SecurityDashboard;
