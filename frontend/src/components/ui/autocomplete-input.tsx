import * as React from "react";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import { Input } from "./input";

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
  placeholder = "Enter destination, address, or landmark...",
  value,
  onChange,
  ...props 
}: AutocompleteInputProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBKF57APna5m5IOBctajRZdtrbDiJYeziw",
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
        // Allow all types of places for maximum flexibility
        // This includes cities, regions, countries, addresses, businesses, landmarks, etc.
        types: [], // Empty array means no restrictions - shows all place types
        componentRestrictions: { country: [] }, // Allow all countries
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