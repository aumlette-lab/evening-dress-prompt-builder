import React from 'react';

// Common props for icons
type IconProps = React.SVGProps<SVGSVGElement>;

export const CogIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.438.995s.145.755.438.995l1.003.827c.48.398.668 1.03.26 1.431l-1.296 2.247a1.125 1.125 0 01-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.075.124a6.57 6.57 0 01-.22.127c-.332.183-.582.495-.645.87l-.213 1.281c-.09.543-.56.94-1.11.94h-2.593c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.645-.87a6.52 6.52 0 01-.22-.127c-.324-.196-.72-.257-1.075-.124l-1.217.456a1.125 1.125 0 01-1.37-.49l-1.296-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.437-.995s-.145-.755-.437-.995l-1.004-.827a1.125 1.125 0 01-.26-1.431l1.296-2.247a1.125 1.125 0 011.37-.49l1.217.456c.355.133.75.072 1.075-.124.073-.044.146-.087.22-.127.332-.183.582-.495.645-.87l.213-1.281z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const DressIcon: React.FC<IconProps> = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 128 128"
        width="1em"
        height="1em"
        {...props}
    >
        <path
            fill="#1565C0"
            d="M89.71 68.54c-5.89-13.16-11.59-21.56-11.59-21.56v-.01H46.05c-1.91 3.74-5.11 9.81-9.71 18.28c-5.59 10.3-18.23 43.45-18.23 43.45s.74 4.38 11.5 6.35c7.14 1.31 9.29.19 15.26 3.43c5.27 2.86 8.92 5.53 17.85 5.53s11.18-2.21 18.45-5.53c6.19-2.83 9.53-1.45 16.64-2.91c15.07-3.09 16.06-14.11 16.06-14.11s-11.52-4.69-24.16-32.92"
        ></path>
        <path
            fill="#1565C0"
            d="M82.54 6.8c.02-.81-.51-1.53-1.28-1.75l-3.46-.98c-1.02-.29-2.05.37-2.22 1.42l-1.71 10.55s-5.3.91-11.17 5.69l-.39-.01c-5.87-4.78-11.29-5.68-11.29-5.68L49.3 5.48a1.773 1.773 0 0 0-2.22-1.42l-3.46.98c-.78.22-1.31.94-1.28 1.75c.09 3.23.4 11.68 1.33 20.24c.95 8.76 3 17.7 2.72 20.85c0 0 8.04 1.1 15.81 1.18v.01h.52v-.01c7.76-.07 15.81-1.18 15.81-1.18c-.28-3.15 1.77-12.09 2.72-20.85c.89-8.56 1.2-17 1.29-20.23"
        ></path>
        <linearGradient
            id="notoDress0"
            x1="37.617"
            x2="86.158"
            y1="46.75"
            y2="46.75"
            gradientUnits="userSpaceOnUse"
        >
            <stop offset="0" stopColor="#03A9F4"></stop>
            <stop offset=".061" stopColor="#20B4F7"></stop>
            <stop offset=".147" stopColor="#42C1FA"></stop>
            <stop offset=".235" stopColor="#5DCBFC"></stop>
            <stop offset=".323" stopColor="#71D2FE"></stop>
            <stop offset=".414" stopColor="#7CD7FF"></stop>
            <stop offset=".509" stopColor="#80D8FF"></stop>
            <stop offset=".609" stopColor="#7DD7FF"></stop>
            <stop offset=".696" stopColor="#72D3FE"></stop>
            <stop offset=".777" stopColor="#60CCFC"></stop>
            <stop offset=".856" stopColor="#47C3FA"></stop>
            <stop offset=".931" stopColor="#27B7F7"></stop>
            <stop offset="1" stopColor="#03A9F4"></stop>
        </linearGradient>
        <path
            fill="url(#notoDress0)"
            d="M63.2 50.16c-9.1 0-15.33-.74-17.45-.98a.78.78 0 0 1-.68-.87l.6-4.28a.77.77 0 0 1 .85-.67c2.03.22 8.09.79 16.68.79c8.26 0 13.23-.53 15-.75c.41-.05.79.23.86.64l.46 4.25c.07.43-.22.84-.66.9c-1.89.24-6.78.97-15.66.97"
        ></path>
        <path
            fill="#0D47A1"
            d="M73.82 16.09c-.84-.13-3.23.81-3.85 1.05c-2.73 1.05-4.99 2.5-7.16 4.45c-.01.01-.14.09-.3.09s-.27-.09-.28-.1c-2.17-1.95-4.45-3.38-7.18-4.43c-.63-.24-3.02-1.18-3.85-1.05c-1 .15.21 1.26 2.02 2.84c1.82 1.58 4.39 3.8 6.57 5.76c.75.67 1.75.97 2.72 1.05c.97-.08 1.97-.38 2.72-1.05c2.18-1.96 4.75-4.18 6.57-5.76s3.02-2.7 2.02-2.85"
        ></path>
        <linearGradient
            id="notoDress1"
            x1="44.427"
            x2="51.535"
            y1="117.96"
            y2="64.944"
            gradientUnits="userSpaceOnUse"
        >
            <stop offset=".297" stopColor="#0D47A1"></stop>
            <stop offset="1" stopColor="#0D47A1" stopOpacity=".2"></stop>
        </linearGradient>
        <path
            fill="url(#notoDress1)"
            d="M39.6 116.06c3.73-28.23 13.54-52.85 13.54-52.85s-3.28 29.02-4.01 57.59c0 0-2.85-1.8-5.46-2.95s-4.07-1.79-4.07-1.79"
        ></path>
        <linearGradient
            id="notoDress2"
            x1="82.779"
            x2="76.996"
            y1="120.125"
            y2="77.91"
            gradientUnits="userSpaceOnUse"
        >
            <stop offset=".297" stopColor="#0D47A1"></stop>
            <stop offset="1" stopColor="#0D47A1" stopOpacity=".2"></stop>
        </linearGradient>
        <path
            fill="url(#notoDress2)"
            d="M77.45 120.26c-2.45-15.11-3.92-30.15-3.21-42.35c0 0 5.55 22.99 13.52 38.73c0 0-2.71.39-5.3 1.29c-1.81.63-5.01 2.33-5.01 2.33"
        ></path>
    </svg>
);

export const CameraIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.776 48.776 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
    </svg>
);

export const RefreshIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-11.664 0l3.181-3.183a8.25 8.25 0 00-11.664 0l3.181 3.183" />
    </svg>
);

export const SparklesIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 22.5l-.648-1.938a3.375 3.375 0 00-2.672-2.672L11.25 18l1.938-.648a3.375 3.375 0 002.672-2.672L16.25 13.5l.648 1.938a3.375 3.375 0 002.672 2.672L21.75 18l-1.938.648a3.375 3.375 0 00-2.672 2.672z" />
    </svg>
);

export const PencilIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);

export const XMarkIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const ClipboardIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a2.25 2.25 0 01-2.25 2.25H9.75A2.25 2.25 0 017.5 4.5v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
    </svg>
);

export const CheckIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);

export const TrashIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);

export const PlusIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

export const ArrowUpIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
    </svg>
);

export const ArrowDownIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
);

export const DuplicateIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15h-1.5A2.25 2.25 0 014.5 12.75v-7.5A2.25 2.25 0 016.75 3h7.5A2.25 2.25 0 0116.5 5.25v1.5M9.75 9h7.5A2.25 2.25 0 0119.5 11.25v7.5A2.25 2.25 0 0117.25 21h-7.5A2.25 2.25 0 017.5 18.75v-7.5A2.25 2.25 0 019.75 9z" />
    </svg>
);

export const DownloadIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

export const UploadIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
);
