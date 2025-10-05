import { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Zap, Battery, TrendingUp, TrendingDown } from 'lucide-react';

interface SSEHome {
  id: string;
  pv: number;
  load: number;
  soc: number;
  share: number;
  recv: number;
  imp: number;
  exp: number;
  creditsDelta: number;
}

interface InteractiveMapProps {
  homes: SSEHome[];
}

interface HousePosition {
  id: string;
  x: number;
  y: number;
  type: 'house' | '101mi' | 'special';
}

const InteractiveMap = ({ homes }: InteractiveMapProps) => {
  const [hoveredHouse, setHoveredHouse] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback((houseId: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHoveredHouse(houseId);
  }, []);

  const handleMouseLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredHouse(null);
    }, 100);
  }, []);

  // House positions on the map (matching the blue squares in your map)
  const housePositions: HousePosition[] = [
    // Houses along Lenah Mill Blvd (main loop) - blue squares (Microgrid)
    { id: 'Johnson', x: 180, y: 160, type: 'house' },
    { id: 'Smith', x: 220, y: 180, type: 'house' },
    { id: 'Williams', x: 260, y: 200, type: 'house' },
    { id: 'Brown', x: 300, y: 220, type: 'house' },
    { id: 'Davis', x: 340, y: 240, type: 'house' },
    { id: 'Miller', x: 380, y: 260, type: 'house' },
    { id: 'Wilson', x: 420, y: 280, type: 'house' },
    { id: 'Moore', x: 460, y: 300, type: 'house' },
    { id: 'Taylor', x: 500, y: 320, type: 'house' },
    { id: 'Anderson', x: 540, y: 340, type: 'house' },
    
    // Houses along Aurumm Sun Dr (curved road) - white squares (Non-microgrid)
    { id: 'Garcia', x: 160, y: 100, type: '101mi' },
    { id: 'Martinez', x: 200, y: 120, type: '101mi' },
    { id: 'Rodriguez', x: 240, y: 140, type: '101mi' },
    { id: 'Lopez', x: 280, y: 160, type: '101mi' },
    
    // Houses along Ladybug Ct (bottom-left) - yellow squares (Special)
    { id: 'Gonzalez', x: 140, y: 380, type: 'special' },
    { id: 'Hernandez', x: 170, y: 400, type: 'special' },
    { id: 'Perez', x: 200, y: 420, type: 'special' },
    { id: 'Sanchez', x: 230, y: 440, type: 'special' },
    { id: 'Ramirez', x: 260, y: 460, type: 'special' },
    
    // Houses along Little Free (mid-right) - blue squares (Microgrid)
    { id: 'Flores', x: 520, y: 180, type: 'house' },
    { id: 'Rivera', x: 560, y: 200, type: 'house' },
    { id: 'Cooper', x: 600, y: 220, type: 'house' },
    { id: 'Reed', x: 640, y: 240, type: 'house' },
    { id: 'Cook', x: 680, y: 260, type: 'house' },
    
    // Additional houses to match simulation data (H016-H020)
    { id: 'Bailey', x: 480, y: 380, type: '101mi' },
    { id: 'Murphy', x: 520, y: 400, type: '101mi' },
    { id: 'Kelly', x: 560, y: 420, type: '101mi' },
    { id: 'Howard', x: 600, y: 440, type: '101mi' },
    { id: 'Ward', x: 640, y: 460, type: '101mi' },
  ];

  // Mapping from family names to simulation IDs
  const familyToSimId: { [key: string]: string } = {
    'Johnson': 'H001',
    'Smith': 'H002', 
    'Williams': 'H003',
    'Brown': 'H004',
    'Davis': 'H005',
    'Miller': 'H006',
    'Wilson': 'H007',
    'Moore': 'H008',
    'Taylor': 'H009',
    'Anderson': 'H010',
    'Garcia': 'H011',
    'Martinez': 'H012',
    'Rodriguez': 'H013',
    'Lopez': 'H014',
    'Gonzalez': 'H015',
    'Flores': 'H016',
    'Rivera': 'H017',
    'Cooper': 'H018',
    'Reed': 'H019',
    'Cook': 'H020',
    'Bailey': 'H021',
    'Murphy': 'H022',
    'Kelly': 'H023',
    'Howard': 'H024',
    'Ward': 'H025'
  };

  const getHouseData = (houseId: string) => {
    // Convert family name to simulation ID
    const simId = familyToSimId[houseId];
    if (!simId) return null;
    
    return homes.find(home => home.id === simId);
  };

  const getHouseColor = (house: HousePosition) => {
    const data = getHouseData(house.id);
    if (!data) return '#94A3B8'; // Soft gray for no data

    // Soft, translucent colors for glass-like effect
    if (data.pv > 0) return '#34D399'; // Soft green for producing
    if (data.share > 0) return '#60A5FA'; // Soft blue for sharing
    if (data.imp > 0) return '#F87171'; // Soft red for importing
    return '#60A5FA'; // Soft blue for neutral
  };

  const getHouseBorderColor = (house: HousePosition) => {
    const data = getHouseData(house.id);
    if (!data) return '#CBD5E1';

    // Soft border colors based on SOC
    if (data.soc > 60) return '#34D399'; // Soft green
    if (data.soc > 30) return '#FBBF24'; // Soft yellow
    return '#F87171'; // Soft red
  };

  const getHouseSize = (house: HousePosition) => {
    const data = getHouseData(house.id);
    if (!data) return 16;

    // Size based on total power (PV + Load)
    const totalPower = data.pv + data.load;
    if (totalPower > 5) return 20;
    if (totalPower > 3) return 18;
    return 16;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <CardTitle>Interactive Community Map</CardTitle>
        </div>
        <CardDescription>
          Hover over houses to see real-time energy data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative rounded-lg overflow-hidden" style={{ height: '600px' }}>
          {/* Map Background */}
          <img
            src="/map.png"
            alt="Lenah Mill Community Map"
            className="absolute inset-0 w-full h-full object-contain"
            style={{ opacity: 0.9 }}
          />
          
          {/* Interactive SVG Overlay */}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1000 800"
            className="absolute inset-0"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Semi-transparent overlay */}
            <rect width="1000" height="800" fill="#000000" fillOpacity="0.1" />
            
            {/* Interactive Houses - Only Blue Houses (Microgrid) */}
            {housePositions.map((house) => {
              const data = getHouseData(house.id);
              const size = getHouseSize(house);
              const isHovered = hoveredHouse === house.id;
              const isInteractive = house.type === 'house'; // Only blue houses are interactive
              
              return (
                <g key={house.id}>
                  {/* Interactive hit area - only for blue houses */}
                  {isInteractive && (
                    <rect
                      x={house.x - size}
                      y={house.y - size}
                      width={size * 2}
                      height={size * 2}
                      fill="transparent"
                      onMouseEnter={() => handleMouseEnter(house.id)}
                      onMouseLeave={handleMouseLeave}
                      style={{ cursor: 'pointer' }}
                    />
                  )}
                  
                  {/* Glass-like House Rectangle */}
                  <rect
                    x={house.x - size/2}
                    y={house.y - size/2}
                    width={size}
                    height={size}
                    fill={getHouseColor(house)}
                    stroke={getHouseBorderColor(house)}
                    strokeWidth={isHovered && isInteractive ? 2 : 1}
                    rx="4"
                    fillOpacity={isHovered && isInteractive ? 0.6 : 0.4}
                    strokeOpacity={isHovered && isInteractive ? 0.8 : 0.6}
                    style={{
                      filter: isHovered && isInteractive
                        ? 'drop-shadow(0 0 12px rgba(96, 165, 250, 0.4)) blur(0.5px)' 
                        : 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.15)) blur(0.2px)',
                      transition: 'all 0.3s ease',
                      cursor: isInteractive ? 'pointer' : 'default',
                      backdropFilter: 'blur(1px)'
                    }}
                  />
                  
                  {/* Glass highlight effect */}
                  {isInteractive && (
                    <rect
                      x={house.x - size/2 + 1}
                      y={house.y - size/2 + 1}
                      width={size - 2}
                      height={size/3}
                      fill="white"
                      fillOpacity={isHovered ? 0.3 : 0.2}
                      rx="2"
                      style={{
                        transition: 'all 0.3s ease'
                      }}
                    />
                  )}
                  
                  {/* Glass Energy Flow Indicators - only for interactive houses */}
                  {isInteractive && data && data.pv > 0 && (
                    <circle
                      cx={house.x}
                      cy={house.y - size/2 - 8}
                      r="3"
                      fill="#34D399"
                      fillOpacity="0.8"
                      stroke="white"
                      strokeWidth="1"
                      strokeOpacity="0.6"
                      className="animate-pulse"
                      style={{
                        filter: 'drop-shadow(0 0 6px rgba(52, 211, 153, 0.5))'
                      }}
                    />
                  )}
                  
                  {isInteractive && data && data.share > 0 && (
                    <circle
                      cx={house.x + size/2 + 4}
                      cy={house.y}
                      r="2"
                      fill="#60A5FA"
                      fillOpacity="0.8"
                      stroke="white"
                      strokeWidth="1"
                      strokeOpacity="0.6"
                      className="animate-pulse"
                      style={{
                        filter: 'drop-shadow(0 0 4px rgba(96, 165, 250, 0.5))'
                      }}
                    />
                  )}
                  
                  {isInteractive && data && data.imp > 0 && (
                    <circle
                      cx={house.x - size/2 - 4}
                      cy={house.y}
                      r="2"
                      fill="#F87171"
                      fillOpacity="0.8"
                      stroke="white"
                      strokeWidth="1"
                      strokeOpacity="0.6"
                      className="animate-pulse"
                      style={{
                        filter: 'drop-shadow(0 0 4px rgba(248, 113, 113, 0.5))'
                      }}
                    />
                  )}
                </g>
              );
            })}
          </svg>
          
          {/* Hover Tooltip - Only for Interactive Houses */}
          {hoveredHouse && (() => {
            const house = housePositions.find(h => h.id === hoveredHouse);
            if (!house || house.type !== 'house') return null; // Only show tooltip for blue houses
            
            return (
              <div
                className="absolute bg-white/95 backdrop-blur-md text-gray-800 p-4 rounded-xl shadow-2xl border border-gray-200/50 z-20 pointer-events-none"
                style={{
                  left: `${Math.min(house.x * 0.8 + 40, 500)}px`,
                  top: `${Math.max(house.y * 0.8 - 120, 20)}px`,
                  maxWidth: '220px',
                  minWidth: '180px'
                }}
              >
              {(() => {
                const data = getHouseData(hoveredHouse);
                if (!data) return <div>No data available</div>;
                
                return (
                  <div className="space-y-3">
                    <div className="font-semibold text-base text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      {hoveredHouse} Family
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 flex items-center gap-2">
                          <Zap className="h-3 w-3 text-green-500" />
                          PV:
                        </span>
                        <span className="font-mono text-green-600 font-medium">{data.pv} kW</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 flex items-center gap-2">
                          <TrendingDown className="h-3 w-3 text-yellow-500" />
                          Load:
                        </span>
                        <span className="font-mono text-yellow-600 font-medium">{data.load} kW</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 flex items-center gap-2">
                          <Battery className="h-3 w-3 text-blue-500" />
                          SOC:
                        </span>
                        <span className="font-mono text-blue-600 font-medium">{data.soc}%</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 flex items-center gap-2">
                          <TrendingUp className="h-3 w-3 text-red-500" />
                          Import:
                        </span>
                        <span className="font-mono text-red-600 font-medium">{data.imp.toFixed(2)} kW</span>
                      </div>
                      
                      {data.share > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            Sharing:
                          </span>
                          <span className="font-mono text-green-600 font-medium">{data.share.toFixed(2)} kW</span>
                        </div>
                      )}
                      
                      {data.recv > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                            Receiving:
                          </span>
                          <span className="font-mono text-cyan-600 font-medium">{data.recv.toFixed(2)} kW</span>
                        </div>
                      )}
                      
                      {data.exp > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                            Exporting:
                          </span>
                          <span className="font-mono text-purple-600 font-medium">{data.exp.toFixed(2)} kW</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
              </div>
            );
          })()}
          
          {/* Glass Legend */}
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md rounded-xl p-4 text-white text-xs border border-white/20 shadow-2xl">
            <div className="text-xs font-semibold mb-3 text-blue-200">🔮 Glass Microgrid Houses</div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded" style={{backgroundColor: '#34D399', opacity: 0.8}}></div>
              <span>Producing (PV)</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded" style={{backgroundColor: '#60A5FA', opacity: 0.8}}></div>
              <span>Sharing Energy</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded" style={{backgroundColor: '#F87171', opacity: 0.8}}></div>
              <span>Importing</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{backgroundColor: '#34D399', opacity: 0.8}}></div>
              <span>Active Energy Flow</span>
            </div>
            <div className="text-xs text-gray-300 mt-2 italic">
              White/Yellow houses are not part of the microgrid
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveMap;
