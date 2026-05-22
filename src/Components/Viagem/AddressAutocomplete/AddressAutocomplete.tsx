import { Building2, Clock3, LoaderCircle, MapPin, Search, X } from 'lucide-react';
import { Fragment, useEffect, useId, useRef, useState } from 'react';

import {
  EnderecoRequest,
  type EnderecoSugestaoResponse,
} from '../../../fetch/EnderecoRequest';
import { useDebounce } from '../../../hooks/useDebounce';

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
      {part.toLowerCase() === searchTerm.toLowerCase() ? <mark className="rounded bg-[#ede7fb] px-0.5 font-semibold text-[#5a34a1]">{part}</mark> : part}
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
  const containerRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const requestCounterRef = useRef(0);

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
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">
        <div className="relative flex items-center">
          <Search
            className={`pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 ${iconColor}`}
          />

          <input
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
            className={`
              w-full rounded-2xl border bg-white py-3.5 pl-11 pr-11 text-sm text-gray-900
              shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-0
              ${disabled ? 'cursor-not-allowed bg-gray-100 text-gray-500' : ''}
              ${error
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-200 focus:border-[#5a34a1] focus:ring-[#5a34a1]/30'
              }
            `}
          />

          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {loading ? (
              <LoaderCircle className="h-5 w-5 animate-spin text-gray-400" />
            ) : value ? (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 transition-colors hover:text-gray-600"
                aria-label="Limpar endereco"
              >
                <X className="h-5 w-5" />
              </button>
            ) : null}
          </div>
        </div>

        {showSuggestions && (
          <div className="absolute left-0 right-0 top-full z-50 mt-3 overflow-hidden rounded-3xl border border-[#e6ddf7] bg-white/95 backdrop-blur-md pointer-events-auto shadow-[0_24px_60px_rgba(90,52,161,0.16)] ring-1 ring-[#5a34a1]/10">
            <div className="border-b border-[#ede7fb] bg-gradient-to-r from-[#f6f1ff] via-white to-[#f9f7ff] px-4 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-[#7b65aa]">
              Sugestoes de endereco
            </div>

            {loading && suggestions.length === 0 && (
                <div className="flex items-center gap-2 px-4 py-4 text-sm text-[#7b65aa]">
                  <LoaderCircle className="h-4 w-4 animate-spin text-[#5a34a1]" />
                  Buscando enderecos...
                </div>
              )}

            {!loading && suggestions.length === 0 && value.trim().length >= 2 && (
              <div className="px-4 py-4 text-sm text-[#7b65aa]">
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
                        transition-colors last:border-b-0 pointer-events-auto
                        ${activeIndex === index ? 'bg-[#f3edff]' : 'bg-white hover:bg-[#faf7ff]'}
                      `}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => handleSelectSuggestion(suggestion)}
                      onMouseEnter={() => setActiveIndex(index)}
                    >
                      <div className="mt-0.5 rounded-full bg-[#f3edff] p-2 text-[#6e55a5]">
                        <SuggestionIcon className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {renderHighlightedText(suggestion.titulo || suggestion.display_name, value)}
                        </p>
                        <p className="mt-0.5 truncate text-sm text-[#7b65aa]">
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

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
