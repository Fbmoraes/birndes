declare module "@/components/ui/*"
declare module "lucide-react"

interface BadgeProps {
  children: React.ReactNode
  className?: string
}

interface ButtonProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  onClick?: () => void
  disabled?: boolean
}

interface CardProps {
  children: React.ReactNode
  className?: string
}

interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

interface CardTitleProps {
  children: React.ReactNode
  className?: string
}

interface CardContentProps {
  children: React.ReactNode
  className?: string
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
}

interface LabelProps {
  children: React.ReactNode
  className?: string
  htmlFor?: string
}

interface TabsProps {
  children: React.ReactNode
  className?: string
  value: string
  onValueChange: (value: string) => void
}

interface TabsListProps {
  children: React.ReactNode
  className?: string
}

interface TabsTriggerProps {
  children: React.ReactNode
  className?: string
  value: string
}

interface TabsContentProps {
  children: React.ReactNode
  className?: string
  value: string
}
