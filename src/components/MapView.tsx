import { useMemo } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, ChevronRight } from 'lucide-react';
import type { ClassItem } from '@/lib/supabase';
import { CATEGORY_COLORS } from '@/lib/constants';
import { useI18n } from '@/lib/i18n';

type Props = {
  classes: ClassItem[];
  onSelectClass: (cls: ClassItem) => void;
};

// Custom marker icon using divIcon — no external image assets needed
function createMarkerIcon(colorClass: string) {
  return L.divIcon({
    className: '',
    html: `<div class="byc-marker ${colorClass}"><div class="byc-marker-dot"></div></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
}

const MARKER_COLORS: Record<string, string> = {
  'Martial Arts': 'marker-rose',
  Music: 'marker-violet',
  Dance: 'marker-pink',
  Art: 'marker-amber',
  Yoga: 'marker-emerald',
  Swimming: 'marker-sky',
  Languages: 'marker-indigo',
  Tennis: 'marker-lime',
  Basketball: 'marker-orange',
  Gym: 'marker-stone',
  Theater: 'marker-fuchsia',
  Football: 'marker-green',
};

// Component to fit map bounds to all markers
function FitBounds({ classes }: { classes: ClassItem[] }) {
  const map = useMap();

  useMemo(() => {
    const points = classes
      .map((c) => c.store)
      .filter((s) => s && s.latitude != null && s.longitude != null);

    if (points.length === 0) return;

    const bounds = L.latLngBounds(
      points.map((s) => [s!.latitude!, s!.longitude!] as [number, number])
    );
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [classes, map]);

  return null;
}

export function MapView({ classes, onSelectClass }: Props) {
  const { tCat, tArea } = useI18n();

  // Group classes by store so we show one marker per store
  const storeMap = useMemo(() => {
    const m = new Map<string, ClassItem[]>();
    for (const cls of classes) {
      if (!cls.store || cls.store.latitude == null || cls.store.longitude == null) continue;
      const key = cls.store.id;
      if (!m.has(key)) m.set(key, []);
      m.get(key)!.push(cls);
    }
    return m;
  }, [classes]);

  return (
    <div className="w-full">
      <MapContainer
        center={[37.9715, 23.7563]}
        zoom={12}
        scrollWheelZoom={false}
        className="w-full h-[600px] rounded-2xl border border-stone-200 shadow-sm"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds classes={classes} />
        {Array.from(storeMap.entries()).map(([storeId, storeClasses]) => {
          const store = storeClasses[0].store!;
          const firstCat = storeClasses[0].category;
          const icon = createMarkerIcon(MARKER_COLORS[firstCat] ?? 'marker-stone');
          return (
            <Marker
              key={storeId}
              position={[store.latitude!, store.longitude!]}
              icon={icon}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <p className="text-xs text-stone-500 font-medium mb-0.5">{store.name}</p>
                  <div className="flex items-center gap-1 text-xs text-stone-400 mb-2">
                    <MapPin className="w-3 h-3" /> {tArea(store.area)}
                  </div>
                  <div className="space-y-1.5">
                    {storeClasses.map((cls) => (
                      <button
                        key={cls.id}
                        onClick={() => onSelectClass(cls)}
                        className="w-full text-left flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg hover:bg-stone-100 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-stone-800 truncate">{cls.title}</p>
                          <span
                            className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${CATEGORY_COLORS[cls.category] ?? 'bg-stone-100 text-stone-700'}`}
                          >
                            {tCat(cls.category)}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-stone-400 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
