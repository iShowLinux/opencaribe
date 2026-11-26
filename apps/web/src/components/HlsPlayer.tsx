'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
type HlsInstance = import('hls.js').default;

interface Props {
  src: string;
  channelName: string;
}

interface QualityOption {
  id: number;
  label: string;
}

interface LevelLike {
  height?: number;
  bitrate?: number;
}

function describeLevel(level: LevelLike): string {
  const parts: string[] = [];
  if (level.height) parts.push(`${level.height}p`);
  if (level.bitrate) parts.push(`${Math.round(level.bitrate / 1000)} kbps`);
  return parts.join(' · ');
}

/**
 * Minimal HLS live player. Only curated HTTPS manifest URLs reach this
 * component; there is no arbitrary-URL input anywhere in the app.
 */
export function HlsPlayer({ src, channelName }: Props) {
  const t = useTranslations('news');
  const tRef = useRef(t);
  useEffect(() => {
    tRef.current = t;
  }, [t]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const hlsRef = useRef<HlsInstance | null>(null);
  const watchdogRef = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [buffering, setBuffering] = useState(true);
  const [levels, setLevels] = useState<QualityOption[]>([]);
  const [level, setLevel] = useState(-1);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let hls: HlsInstance | null = null;
    const element = videoRef.current;
    if (!element) return;
    const video: HTMLVideoElement = element;

    async function start() {
      setError(null);
      setBuffering(true);
      if (watchdogRef.current) window.clearTimeout(watchdogRef.current);
      watchdogRef.current = window.setTimeout(() => {
        const media = videoRef.current;
        if (!cancelled && media && media.readyState < 2) {
          setError(tRef.current('errorBody'));
        }
      }, 20000);
      try {
        const { default: Hls } = await import('hls.js');
        if (cancelled) return;

        if (Hls.isSupported()) {
          hls = new Hls({ enableWorker: true, capLevelToPlayerSize: true });
          hlsRef.current = hls;
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            if (cancelled) return;
            setLevels(
              (hls?.levels ?? []).map((item, index) => ({ id: index, label: describeLevel(item) })),
            );
            void video.play().catch(() => undefined);
          });
          hls.on(Hls.Events.ERROR, (_event, data) => {
            if (cancelled || !data.fatal) return;
            if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
              setError(tRef.current('errorTitle'));
              hls?.startLoad();
            } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
              hls?.recoverMediaError();
            } else {
              setError(tRef.current('errorBody'));
            }
          });
          hls.on(Hls.Events.FRAG_BUFFERED, () => {
            if (!cancelled) setBuffering(false);
          });
          hls.loadSource(src);
          hls.attachMedia(video);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = src;
          video.addEventListener('loadedmetadata', () => {
            void video.play().catch(() => undefined);
          });
          setBuffering(false);
        } else {
          setError(tRef.current('errorBody'));
          setBuffering(false);
        }
      } catch {
        if (!cancelled) {
          setError(tRef.current('errorBody'));
          setBuffering(false);
        }
      }
    }

    void start();

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onWaiting = () => setBuffering(true);
    const onPlaying = () => setBuffering(false);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('waiting', onWaiting);
    video.addEventListener('playing', onPlaying);

    return () => {
      cancelled = true;
      if (watchdogRef.current) {
        window.clearTimeout(watchdogRef.current);
        watchdogRef.current = null;
      }
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('playing', onPlaying);
      hlsRef.current = null;
      hls?.destroy();
    };
  }, [src, retryKey]);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play().catch(() => undefined);
    else video.pause();
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }

  function changeLevel(nextId: number) {
    setLevel(nextId);
    const hls = hlsRef.current;
    if (hls) {
      hls.currentLevel = nextId;
      return;
    }
    setRetryKey((value) => value + 1);
  }

  function toggleFullscreen() {
    const frame = frameRef.current;
    if (!frame) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void frame.requestFullscreen().catch(() => undefined);
  }

  return (
    <div ref={frameRef} className="overflow-hidden rounded-xl bg-navy-950">
      <div className="relative aspect-video w-full">
        <video
          ref={videoRef}
          className="h-full w-full bg-black"
          playsInline
          muted={muted}
          aria-label={`${t('nowPlaying')}: ${channelName}`}
        />
        <span className="absolute left-3 top-3 rounded-full bg-rose-600 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
          {t('live')}
        </span>
        {buffering && !error && (
          <div className="absolute inset-0 grid place-items-center bg-navy-950/40" role="status">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            <span className="sr-only">{t('play')}</span>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 grid place-items-center gap-3 bg-navy-950/85 p-6 text-center">
            <p className="font-semibold text-white">{t('errorTitle')}</p>
            <p className="max-w-md text-sm text-slate-300">{t('errorBody')}</p>
            <button
              type="button"
              onClick={() => setRetryKey((value) => value + 1)}
              className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
            >
              {t('retry')}
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-white/10 bg-navy-900 px-3 py-2.5">
        <button
          type="button"
          onClick={togglePlay}
          className="rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/20"
          aria-label={playing ? t('pause') : t('play')}
        >
          {playing ? '❚❚' : '▶'}
          <span className="ml-2">{playing ? t('pause') : t('play')}</span>
        </button>
        <button
          type="button"
          onClick={toggleMute}
          className="rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/20"
          aria-label={muted ? t('unmute') : t('mute')}
        >
          {muted ? '🔇' : '🔊'}
          <span className="ml-2">{muted ? t('unmute') : t('mute')}</span>
        </button>
        {levels.length > 0 && (
          <label className="ml-auto flex items-center gap-2 text-xs text-slate-300">
            {t('quality')}
            <select
              value={level}
              onChange={(event) => changeLevel(Number(event.target.value))}
              className="rounded-lg border border-white/20 bg-navy-950 px-2 py-2 text-xs text-white"
            >
              <option value={-1}>{t('autoQuality')}</option>
              {levels.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        )}
        <button
          type="button"
          onClick={toggleFullscreen}
          className="rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/20"
          aria-label={t('fullscreen')}
        >
          ⛶ {t('fullscreen')}
        </button>
      </div>
    </div>
  );
}
