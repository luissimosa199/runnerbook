import { IframeHTMLAttributes } from "react";

interface IFrameProps extends IframeHTMLAttributes<HTMLIFrameElement> {
  src: string;
  w?: string;
  h?: string;
  frameBorder?: string;
  title?: string;
}

const IFrame: React.FC<IFrameProps> = ({
  src,
  w = "100%",
  h = "100%",
  title = "iframe",
  ...props
}) => (
  <iframe
    src={src}
    width={w}
    height={h}
    title={title}
    {...props}
  />
);

export default IFrame;
