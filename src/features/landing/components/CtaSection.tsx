import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import { Link } from "react-router"

export function CTASection() {
    return (
        <section className="py-24 px-6">
            <div className="max-w-4xl mx-auto text-center">
                <div className="glass rounded-3xl p-12 glow">
                    <div className="flex items-center justify-center mb-6">
                        <Sparkles className="w-8 h-8 text-primary" />
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
                        Transforma tu proceso de{" "}
                        <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                            QA hoy mismo
                        </span>
                    </h2>

                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
                        Únete a cientos de equipos que ya automatizaron sus informes de testing y mejoraron su productividad en un
                        90%.
                    </p>

                    <div className="flex justify-center">
                        <Link to="/login" viewTransition>
                            <Button size="lg" className="glow-hover text-lg px-8 py-6">
                                Comienza ahora
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </div>

                    <p className="text-sm text-muted-foreground mt-6">
                        Prototipo académico • Configuración en 5 minutos • Proyecto piloto
                    </p>
                </div>
            </div>
        </section>
    )
}
