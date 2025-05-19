interface ProgressBarProps {
    progress: number;
    label: string;
    type: 'primary' | 'info' | 'error' | 'warning' | 'secondary';
}

const ProgressBar = ({ progress, label, type }: ProgressBarProps) => {
    const typeClass = 
        type === 'primary' ? 'progress-primary' : 
        type === 'info' ? 'progress-info' : 
        type === 'error' ? 'progress-error' : 
        type === 'warning' ? 'progress-warning' : 
        'progress-secondary';
    return (
        <div class="flex flex-1 flex-row items-center justify-between font-semibold ">
            <div class="uppercase tracking-wide">{label}</div>
            <progress class={`progress w-56 ${typeClass}`} value={progress} max="100"></progress>
        </div>
    )
}

export default ProgressBar;