import { Building2, Clock3, LoaderCircle, MapPin, Mic, Search, X } from 'lucide-react';
import { Fragment, useEffect, useId, useRef, useState } from 'react';

import {
  EnderecoRequest,
  type EnderecoSugestaoResponse,
} from '../../../fetch/EnderecoRequest';
import { useDebounce } from '../../../hooks/useDebounce';
import { loadAccessibilityPreferences } from '../../../utils/accessibilityPreferences';
import { loadDashboardPreferences } from '../../../utils/dashboardPreferences';

interface SpeechRecognitionResultLike extends ArrayLike<{ transcript: string }> {}

interface SpeechRecognitionEventLike {
  results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

export interface AutocompleteAddress extends EnderecoSugestaoResponse {}

export interface AutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (address: AutocompleteAddress) => void;
  placeholder?: string;
  label?: string;
  iconColor?: string;
  maxSuggestions?: number;
  disabled?: boolean;
  error?: string;
  className?: string;
  required?: boolean;
}

function getSuggestionIcon(suggestion: AutocompleteAddress) {
  if (suggestion.categoria === 'house' || suggestion.categoria === 'residential') {
    return Clock3;
  }

  if (suggestion.categoria === 'amenity' || suggestion.categoria === 'building') {
    return Building2;
  }

  return MapPin;
}

function getSecondaryLocationText(suggestion: AutocompleteAddress) {
  if (suggestion.subtitulo) {
    return suggestion.subtitulo;
  }

  const city =
    suggestion.address?.city ??
    suggestion.address?.town ??
    suggestion.address?.village ??
    suggestion.address?.municipality;

  return [city, suggestion.address?.state].filter(Boolean).join(', ');
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function renderHighlightedText(text: string, query: string) {
  const searchTerm = query.trim();

  if (!searchTerm) {
    return text;
  }

  const matcher = new RegExp(`(${escapeRegExp(searchTerm)})`, 'ig');
  const parts = text.split(matcher).filter(Boolean);

  return parts.map((part, index) => (
    <Fragment key={`${part}-${index}`}>
      {part.toLowerCase() === searchTerm.toLowerCase() ? <mark className="rounded bg-[#ede7fb] px-0.5 font-semibold text-[#5a34a1] dark:bg-violet-400/20 dark:text-violet-200">{part}</mark> : part}
    </Fragment>
  ));
}

export function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = 'Digite um endereco...',
  label,
  iconColor = 'text-blue-600',
  maxSuggestions = 5,
  disabled = false,
  error,
  className,
  required = false,
}: AutocompleteProps) {
  const [suggestions, setSuggestions] = useState<AutocompleteAddress[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debouncedValue = useDebounce(value, 300);
  const suggestionsId = useId();
  const inputId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const speechRecognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const requestCounterRef = useRef(0);
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const voiceCommandsEnabled = loadAccessibilityPreferences().voiceCommands;
  const speechLocale = loadDashboardPreferences().language;

  useEffect(() => () => speechRecognitionRef.current?.stop(), []);

  useEffect(() => {
    const termo = debouncedValue.trim();
    const currentRequestId = requestCounterRef.current + 1;
    requestCounterRef.current = currentRequestId;

    if (termo.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      setLoading(false);
      return;
    }

    let isActive = true;
    setLoading(true);
    setShowSuggestions(true);

    const fetchSuggestions = async () => {
      try {
        const results = await EnderecoRequest.buscarSugestoes(termo, maxSuggestions);

        if (!isActive || requestCounterRef.current !== currentRequestId) {
          return;
        }

        setSuggestions(results);
        setActiveIndex(-1);
      } catch (fetchError) {
        console.error('Erro ao buscar sugestoes:', fetchError);

        if (isActive) {
          setSuggestions([]);
        }
      } finally {
        if (isActive && requestCounterRef.current === currentRequestId) {
          setLoading(false);
        }
      }
    };

    fetchSuggestions();

    return () => {
      isActive = false;
    };
  }, [debouncedValue, maxSuggestions]);

  useEffect(() => {
    if (activeIndex >= 0 && suggestionsRef.current) {
      const activeItem = suggestionsRef.current.children[activeIndex] as HTMLElement | undefined;
      activeItem?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setShowSuggestions(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        event.preventDefault();
        if (activeIndex >= 0 && activeIndex < suggestions.length) {
          handleSelectSuggestion(suggestions[activeIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setActiveIndex(-1);
        break;
      default:
        break;
    }
  };

  const handleSelectSuggestion = (suggestion: AutocompleteAddress) => {
    onChange(suggestion.display_name);
    onSelect(suggestion);
    setShowSuggestions(false);
    setActiveIndex(-1);
    setSuggestions([]);
  };

  const handleClear = () => {
    onChange('');
    setSuggestions([]);
    setShowSuggestions(false);
    setActiveIndex(-1);
    setLoading(false);
    inputRef.current?.focus();
  };

  const handleVoiceInput = () => {
    const speechWindow = window as Window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const Recognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;

    if (!Recognition) {
      setVoiceError('Ditado por voz indisponível neste navegador. Você pode digitar o endereço.');
      return;
    }

    if (isListening) {
      speechRecognitionRef.current?.stop();
      return;
    }

    const recognition = new Recognition();
    setVoiceError(null);
    recognition.lang = speechLocale;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim();
      if (transcript) {
        onChange(transcript);
        setShowSuggestions(transcript.length >= 2);
        inputRef.current?.focus();
      }
    };
    recognition.onerror = (event) => {
      setVoiceError(event.error === 'not-allowed'
        ? 'Permita o acesso ao microfone para usar o ditado por voz.'
        : 'Não foi possível reconhecer a fala. Tente novamente ou digite o endereço.');
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
    speechRecognitionRef.current = recognition;
    setIsListening(true);
    recognition.start();
  };

  const handleFocus = () => {
    if (value.trim().length >= 2) {
      setShowSuggestions(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`${className ?? ''} ${showSuggestions ? 'relative z-50 isolate' : 'relative'}`}
    >
      {label && (
        <label htmlFor={inputId} className="mb-2 block text-sm font-semibold text-gray-700 dark:text-slate-200">
          {label}
        </label>
      )}

      <div className="relative">
        <div className="relative flex items-center">
          <Search
            className={`pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 ${iconColor}`}
          />

          <input
            id={inputId}
            ref={inputRef}
            type="text"
            value={value}
            onChange={(event) => {
              const nextValue = event.target.value;
              onChange(nextValue);
              setActiveIndex(-1);
              setShowSuggestions(nextValue.trim().length >= 2);
            }}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            autoComplete="off"
            role="combobox"
            aria-expanded={showSuggestions}
            aria-autocomplete="list"
            aria-controls={suggestionsId}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={`
              w-full rounded-2xl border bg-white py-3.5 pl-11 pr-20 text-sm text-gray-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400
              shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-0
              ${disabled ? 'cursor-not-allowed bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-slate-500' : ''}
              ${error
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-500/60'
                : 'border-gray-200 focus:border-[#5a34a1] focus:ring-[#5a34a1]/30 dark:focus:border-violet-400 dark:focus:ring-violet-400/30'
              }
            `}
          />

          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
            {voiceCommandsEnabled && (
              <button
                type="button"
                onClick={handleVoiceInput}
                disabled={disabled || loading}
                className={`inline-flex size-8 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${isListening ? 'bg-red-100 text-red-600 dark:bg-red-400/15 dark:text-red-300' : 'text-slate-400 hover:bg-violet-50 hover:text-violet-700 dark:text-slate-400 dark:hover:bg-violet-400/10 dark:hover:text-violet-300'}`}
                aria-label={isListening ? 'Parar ditado por voz' : `Ditado por voz: ${label ?? placeholder}`}
                aria-pressed={isListening}
                title={isListening ? 'Ouvindo… clique para parar' : 'Preencher endereço por voz'}
              >
                {isListening ? <span className="size-2.5 animate-pulse rounded-full bg-current" /> : <Mic className="size-4" aria-hidden="true" />}
              </button>
            )}
            {loading ? (
              <LoaderCircle className="h-5 w-5 animate-spin text-gray-400" />
            ) : value ? (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex size-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-slate-100 hover:text-gray-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                aria-label="Limpar endereço"
              >
                <X className="h-5 w-5" />
              </button>
            ) : null}
          </div>
        </div>

        {isListening && <span className="sr-only" role="status" aria-live="polite">Ouvindo endereço. Fale agora.</span>}
        {voiceError && <p className="mt-1 text-xs text-amber-700 dark:text-amber-300" role="status">{voiceError}</p>}

        {showSuggestions && (
          <div className="pointer-events-auto absolute left-0 right-0 top-full z-50 mt-3 overflow-hidden rounded-3xl border border-[#e6ddf7] bg-white/95 shadow-[0_24px_60px_rgba(90,52,161,0.16)] ring-1 ring-[#5a34a1]/10 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/95 dark:shadow-[0_24px_60px_rgba(0,0,0,0.45)] dark:ring-white/5">
            <div className="border-b border-[#ede7fb] bg-gradient-to-r from-[#f6f1ff] via-white to-[#f9f7ff] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#7b65aa] dark:border-slate-700 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 dark:text-violet-200">
              Sugestoes de endereco
            </div>

            {loading && suggestions.length === 0 && (
                <div className="flex items-center gap-2 px-4 py-4 text-sm text-[#7b65aa] dark:text-slate-300">
                  <LoaderCircle className="h-4 w-4 animate-spin text-[#5a34a1] dark:text-violet-300" />
                  Buscando enderecos...
                </div>
              )}

            {!loading && suggestions.length === 0 && value.trim().length >= 2 && (
              <div className="px-4 py-4 text-sm text-[#7b65aa] dark:text-slate-300">
                Nenhuma sugestao encontrada para "{value.trim()}"
              </div>
            )}

            {suggestions.length > 0 && (
              <ul
                id={suggestionsId}
                ref={suggestionsRef}
                className="max-h-80 overflow-y-auto overscroll-contain"
                role="listbox"
              >
                {suggestions.map((suggestion, index) => {
                  const SuggestionIcon = getSuggestionIcon(suggestion);
                  const secondaryText = getSecondaryLocationText(suggestion);

                  return (
                    <li
                      key={`${suggestion.lat}-${suggestion.lon}-${index}`}
                      role="option"
                      aria-selected={activeIndex === index}
                      className={`
                        relative flex cursor-pointer items-start gap-3 border-b border-[#f1ebfc] px-4 py-3.5
                        transition-colors last:border-b-0 pointer-events-auto dark:border-slate-700/80
                        ${activeIndex === index
                          ? 'bg-[#f3edff] dark:bg-violet-400/15'
                          : 'bg-white hover:bg-[#faf7ff] dark:bg-slate-900 dark:hover:bg-slate-800'}
                      `}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => handleSelectSuggestion(suggestion)}
                      onMouseEnter={() => setActiveIndex(index)}
                    >
                      <div className="mt-0.5 rounded-full bg-[#f3edff] p-2 text-[#6e55a5] dark:bg-slate-800 dark:text-violet-300">
                        <SuggestionIcon className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-900 dark:text-slate-100">
                          {renderHighlightedText(suggestion.titulo || suggestion.display_name, value)}
                        </p>
                        <p className="mt-0.5 truncate text-sm text-[#7b65aa] dark:text-slate-400">
                          {renderHighlightedText(secondaryText || suggestion.display_name, value)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>

      {error && <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600" role="alert">{error}</p>}
    </div>
  );
}
