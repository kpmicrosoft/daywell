import daywellLogo from '../assets/daywell-logo.svg';

export function Logo() {
  return (
    <div className="flex items-center justify-center pt-6">
      <div className="flex items-center">
        <img src={daywellLogo} alt="Daywell Logo" className="h-18 w-18" />
      </div>
    </div>
  );
}