import * as React from "react";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import { Input } from "./input";
import { cn } from "./utils";

const libraries: "places"[] = ["places"];

interface AutocompleteInputProps extends React.ComponentProps<"input"> {
  onPlaceSelect?: (place: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AutocompleteInput({ 
  onPlaceSelect, 
  className, 
  placeholder = "Enter a location...",
  value,
  onChange,
  ...props 
}: AutocompleteInputProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const [autocomplete, setAutocomplete] = React.useState<google.maps.places.Autocomplete | null>(null);

  const onLoad = React.useCallback((autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance);
  }, []);

  const onPlaceChanged = React.useCallback(() => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (onPlaceSelect) {
        onPlaceSelect(place);
      }
    }
  }, [autocomplete, onPlaceSelect]);

  if (loadError) {
    console.error("Error loading Google Maps:", loadError);
    // Fallback to regular input if Google Maps fails to load
    return (
      <Input
        className={className}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
      />
    );
  }

  if (!isLoaded) {
    // Show loading state or regular input while Google Maps is loading
    return (
      <Input
        className={className}
        placeholder="Loading..."
        disabled
        {...props}
      />
    );
  }

  return (
    <Autocomplete
      onLoad={onLoad}
      onPlaceChanged={onPlaceChanged}
      options={{
        types: ["(cities)"], // Restrict to cities, you can customize this
        componentRestrictions: { country: [] }, // Remove country restriction or set specific countries
      }}
    >
      <Input
        className={className}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
      />
    </Autocomplete>
  );
}