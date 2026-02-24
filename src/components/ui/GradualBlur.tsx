interface GradualBlurProps {
    className?: string;
    position?: "top" | "bottom" | "left" | "right";
    blurAmount?: string;
    fadeStart?: number;
    fadeEnd?: number;
}

export const GradualBlur = ({
    className = "",
    position = "bottom",
    blurAmount = "12px",
    fadeStart = 0,
    fadeEnd = 100,
}: GradualBlurProps) => {
    // The mask allows the blur to show where it's "black" and hides it where "transparent"
    // So if position="bottom", it means we want blur AT the bottom.
    // The mask goes "to top", starting transparent, ending black. This means the top is black (so blur shows at top) - wait.
    // Let's explicitly define directions so:
    // top: blurred at top, clear at bottom -> mask is black at top, transparent at bottom -> linear-gradient(to bottom, black, transparent)
    // bottom: blurred at bottom, clear at top -> mask is transparent at top, black at bottom -> linear-gradient(to bottom, transparent, black)

    let actualGradient = "";
    if (position === "top") actualGradient = `linear-gradient(to bottom, black ${fadeStart}%, transparent ${fadeEnd}%)`;
    if (position === "bottom") actualGradient = `linear-gradient(to top, black ${fadeStart}%, transparent ${fadeEnd}%)`;
    if (position === "left") actualGradient = `linear-gradient(to right, black ${fadeStart}%, transparent ${fadeEnd}%)`;
    if (position === "right") actualGradient = `linear-gradient(to left, black ${fadeStart}%, transparent ${fadeEnd}%)`;

    return (
        <div
            className={`absolute pointer-events-none z-10 ${className}`}
            style={{
                backdropFilter: `blur(${blurAmount})`,
                WebkitBackdropFilter: `blur(${blurAmount})`,
                maskImage: actualGradient,
                WebkitMaskImage: actualGradient,
            }}
        />
    );
};
