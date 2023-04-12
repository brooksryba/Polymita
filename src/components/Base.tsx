import { FC, ReactNode } from 'react';


export function Header() {
    return (
        <header>
            <h1>Brooks Ryba</h1>
            <h2>Painting, Pottery & Photography</h2>
            <hr />
            <nav>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/gallery">Gallery</a></li>
                    <li><a href="/store">Store</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/contact">Contact</a></li>
                </ul>
            </nav>
            <hr />
        </header>
    )
}


export function Footer() {
    return (
        <footer>
            <hr />
            &copy; 2023 - All rights reserved
        </footer>
    )
}

interface HeadingProps {
    level: Number,
    children: ReactNode;
    icon?: string;
}

export const Heading: FC<HeadingProps> = ({ level, children, icon }) => {
    const Tag = "h" + level as keyof JSX.IntrinsicElements;
    return <Tag>{icon ? <MaterialIcon name={icon} /> : null}{children}</Tag>;
}

interface OptionalProps {
    condition: boolean;
    children: ReactNode;
}

export const Optional: FC<OptionalProps> = ({ condition, children }) => {
    return condition ? <>{children}</> : null;
};

interface MaterialIconProps {
    name: string,
    onClick?: Function
}

export const MaterialIcon: FC<MaterialIconProps> = ({ name, onClick }) => {
    return (
        <span className="material-symbols-outlined" onClick={() => onClick ? onClick() : null}>{name}</span>
    );
};

interface MaterialButtonProps {
    name: string,
    onClick: Function | undefined,
    className: string,
}

export const MaterialButton: FC<MaterialButtonProps> = ({ name, onClick, className }) => {
    return (
        <button className={className} onClick={() => onClick ? onClick() : null}>
            <MaterialIcon name={name} />
        </button>
    );
};

interface InputProps {
    label: string;
    type: string;
    name: string;
    className?: string;
    autoComplete?: string;
    value?: string;
    onChange: Function;
}

export const Input: FC<InputProps> = ({ type, label, name, className, autoComplete, value, onChange }) => {
    return (
        <>
            <label htmlFor={name}>{label}</label>
            <input type={type} name={name} className={className} value={value} onChange={(e:React.ChangeEvent<HTMLInputElement>) => onChange(e)} autoComplete={autoComplete}/>
        </>
    );
};
