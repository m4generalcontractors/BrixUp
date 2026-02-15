/**
 * BrixUp Internationalization (i18n) System
 *
 * Simple bilingual dictionary for English and Spanish.
 * Keys are organized by page and section for maintainability.
 */

export type Lang = "en" | "es";

const dictionary: Record<string, { en: string; es: string }> = {
  // -------------------------------------------------------------------------
  // Shared / Global
  // -------------------------------------------------------------------------
  "global.langToggle": {
    en: "ES",
    es: "EN",
  },
  "global.langLabel": {
    en: "Español",
    es: "English",
  },
  "global.brixup": {
    en: "BrixUp",
    es: "BrixUp",
  },
  "global.brix": {
    en: "$BRXU",
    es: "$BRXU",
  },
  "global.back": {
    en: "Back",
    es: "Atrás",
  },
  "global.next": {
    en: "Next",
    es: "Siguiente",
  },
  "global.submit": {
    en: "Submit",
    es: "Enviar",
  },
  "global.required": {
    en: "Required",
    es: "Obligatorio",
  },
  "global.optional": {
    en: "Optional",
    es: "Opcional",
  },
  "global.forContractors": {
    en: "For Contractors",
    es: "Para Contratistas",
  },

  // -------------------------------------------------------------------------
  // Contractor Landing Page — Hero
  // -------------------------------------------------------------------------
  "landing.hero.headline": {
    en: "Your Work is Worth More Than You're Paid",
    es: "Tu trabajo vale más de lo que te pagan",
  },
  "landing.hero.subheadline": {
    en: "BrixUp turns your labor into ownership. Earn $BRXU tokens on every project, convert them to real cash, and build long-term wealth from the work you already do.",
    es: "BrixUp convierte tu trabajo en propiedad. Gana tokens $BRXU en cada proyecto, conviértelos en dinero real y construye riqueza a largo plazo con el trabajo que ya haces.",
  },
  "landing.hero.cta": {
    en: "Start Earning Today",
    es: "Empieza a Ganar Hoy",
  },

  // -------------------------------------------------------------------------
  // Contractor Landing Page — Steps
  // -------------------------------------------------------------------------
  "landing.steps.title": {
    en: "How It Works",
    es: "Cómo Funciona",
  },
  "landing.steps.step1.title": {
    en: "Sign Up",
    es: "Regístrate",
  },
  "landing.steps.step1.desc": {
    en: "Create your free account in under 2 minutes. No paperwork, no fees.",
    es: "Crea tu cuenta gratis en menos de 2 minutos. Sin papeleo, sin cargos.",
  },
  "landing.steps.step2.title": {
    en: "Pick a Deal",
    es: "Elige un Proyecto",
  },
  "landing.steps.step2.desc": {
    en: "Browse available construction deals near you. Choose the ones that match your trade.",
    es: "Explora proyectos de construcción cerca de ti. Elige los que coincidan con tu oficio.",
  },
  "landing.steps.step3.title": {
    en: "Earn $BRXU",
    es: "Gana $BRXU",
  },
  "landing.steps.step3.desc": {
    en: "Get paid in $BRXU tokens that convert to real money. Plus earn profit share when the project succeeds.",
    es: "Recibe pago en tokens $BRXU que se convierten en dinero real. Además gana participación en las ganancias cuando el proyecto tiene éxito.",
  },

  // -------------------------------------------------------------------------
  // Contractor Landing Page — Benefits
  // -------------------------------------------------------------------------
  "landing.benefits.title": {
    en: "Why Builders Choose BrixUp",
    es: "Por Qué los Constructores Eligen BrixUp",
  },
  "landing.benefits.card1.title": {
    en: "Own What You Build",
    es: "Sé dueño de lo que construyes",
  },
  "landing.benefits.card1.desc": {
    en: "Your sweat equity earns you real profit share. When the project makes money, you make money — beyond your hourly rate.",
    es: "Tu esfuerzo te da participación real en las ganancias. Cuando el proyecto genera dinero, tú ganas dinero — más allá de tu tarifa por hora.",
  },
  "landing.benefits.card2.title": {
    en: "Get Paid Faster",
    es: "Cobra más rápido",
  },
  "landing.benefits.card2.desc": {
    en: "$BRXU converts to USDC instantly, then ACH deposits straight to your bank account. No more waiting 30-60 days.",
    es: "$BRXU se convierte a USDC al instante, luego depósitos ACH directo a tu cuenta bancaria. No más esperas de 30-60 días.",
  },
  "landing.benefits.card3.title": {
    en: "Build Your Reputation",
    es: "Construye tu reputación",
  },
  "landing.benefits.card3.desc": {
    en: "Your Brix Score tracks quality, reliability, and experience. A higher score unlocks better-paying deals and priority access.",
    es: "Tu Puntaje Brix registra calidad, confiabilidad y experiencia. Un puntaje más alto desbloquea mejores proyectos y acceso prioritario.",
  },

  // -------------------------------------------------------------------------
  // Contractor Landing Page — Testimonials
  // -------------------------------------------------------------------------
  "landing.testimonials.title": {
    en: "Builders Like You",
    es: "Constructores Como Tú",
  },
  "landing.testimonials.t1.quote": {
    en: "I used to chase payments for weeks. With BrixUp, I earned $BRXU on my first project and had cash in my account in 2 days. Game changer.",
    es: "Antes perseguía pagos por semanas. Con BrixUp, gané $BRXU en mi primer proyecto y tuve efectivo en mi cuenta en 2 días. Un cambio total.",
  },
  "landing.testimonials.t1.name": {
    en: "Marcus Johnson",
    es: "Marcus Johnson",
  },
  "landing.testimonials.t1.trade": {
    en: "Electrician — Atlanta, GA",
    es: "Electricista — Atlanta, GA",
  },
  "landing.testimonials.t2.quote": {
    en: "The profit share is what got me. I framed 3 units, and when they sold, I got a bonus I never expected. This is how construction should work.",
    es: "La participación en ganancias fue lo que me convenció. Hice el armazón de 3 unidades, y cuando se vendieron, recibí un bono que nunca esperé. Así debería funcionar la construcción.",
  },
  "landing.testimonials.t2.name": {
    en: "Carlos Mendoza",
    es: "Carlos Mendoza",
  },
  "landing.testimonials.t2.trade": {
    en: "Framing Contractor — Houston, TX",
    es: "Contratista de Armazón — Houston, TX",
  },
  "landing.testimonials.t3.quote": {
    en: "My Brix Score went up after 2 projects and I got offered a lead role on a bigger deal. It actually rewards good work.",
    es: "Mi Puntaje Brix subió después de 2 proyectos y me ofrecieron un rol principal en un proyecto más grande. Realmente recompensa el buen trabajo.",
  },
  "landing.testimonials.t3.name": {
    en: "Jasmine Williams",
    es: "Jasmine Williams",
  },
  "landing.testimonials.t3.trade": {
    en: "HVAC Technician — Miami, FL",
    es: "Técnica de HVAC — Miami, FL",
  },

  // -------------------------------------------------------------------------
  // Contractor Landing Page — Video
  // -------------------------------------------------------------------------
  "landing.video.title": {
    en: "Watch: What is $BRXU?",
    es: "Mira: ¿Qué es $BRXU?",
  },
  "landing.video.desc": {
    en: "In 90 seconds, learn how $BRXU tokens turn your labor into lasting wealth.",
    es: "En 90 segundos, aprende cómo los tokens $BRXU convierten tu trabajo en riqueza duradera.",
  },
  "landing.video.play": {
    en: "Play Video",
    es: "Reproducir Video",
  },

  // -------------------------------------------------------------------------
  // Contractor Landing Page — Final CTA
  // -------------------------------------------------------------------------
  "landing.cta.headline": {
    en: "Join the Builder Army — Get 1,000 $BRXU Free",
    es: "Únete al Ejército de Constructores — Recibe 1,000 $BRXU Gratis",
  },
  "landing.cta.subtext": {
    en: "Sign up now and we'll drop 1,000 $BRXU into your wallet. No strings attached.",
    es: "Regístrate ahora y depositaremos 1,000 $BRXU en tu billetera. Sin compromisos.",
  },
  "landing.cta.button": {
    en: "Claim My 1,000 $BRXU",
    es: "Reclamar Mis 1,000 $BRXU",
  },

  // -------------------------------------------------------------------------
  // Onboarding — General
  // -------------------------------------------------------------------------
  "onboarding.title": {
    en: "Contractor Onboarding",
    es: "Registro de Contratista",
  },
  "onboarding.step": {
    en: "Step",
    es: "Paso",
  },
  "onboarding.of": {
    en: "of",
    es: "de",
  },

  // -------------------------------------------------------------------------
  // Onboarding — Step 1: Basic Info
  // -------------------------------------------------------------------------
  "onboarding.step1.title": {
    en: "Basic Info",
    es: "Información Básica",
  },
  "onboarding.step1.subtitle": {
    en: "Tell us about yourself so we can match you with the right deals.",
    es: "Cuéntanos sobre ti para que podamos conectarte con los proyectos correctos.",
  },
  "onboarding.step1.fullName": {
    en: "Full Name",
    es: "Nombre Completo",
  },
  "onboarding.step1.phone": {
    en: "Phone Number",
    es: "Número de Teléfono",
  },
  "onboarding.step1.email": {
    en: "Email Address",
    es: "Correo Electrónico",
  },
  "onboarding.step1.trade": {
    en: "Primary Trade",
    es: "Oficio Principal",
  },
  "onboarding.step1.selectTrade": {
    en: "Select your trade...",
    es: "Selecciona tu oficio...",
  },
  "onboarding.step1.location": {
    en: "Location (City, State)",
    es: "Ubicación (Ciudad, Estado)",
  },
  "onboarding.step1.experience": {
    en: "Years of Experience",
    es: "Años de Experiencia",
  },

  // -------------------------------------------------------------------------
  // Onboarding — Trades
  // -------------------------------------------------------------------------
  "trade.electrical": { en: "Electrical", es: "Electricidad" },
  "trade.plumbing": { en: "Plumbing", es: "Plomería" },
  "trade.hvac": { en: "HVAC", es: "HVAC / Climatización" },
  "trade.framing": { en: "Framing", es: "Armazón / Estructura" },
  "trade.roofing": { en: "Roofing", es: "Techado" },
  "trade.concrete": { en: "Concrete", es: "Concreto" },
  "trade.painting": { en: "Painting", es: "Pintura" },
  "trade.drywall": { en: "Drywall", es: "Drywall / Tablaroca" },
  "trade.tile": { en: "Tile", es: "Azulejo / Mosaico" },
  "trade.generalLabor": { en: "General Labor", es: "Trabajo General" },
  "trade.other": { en: "Other", es: "Otro" },

  // -------------------------------------------------------------------------
  // Onboarding — Step 2: Credentials
  // -------------------------------------------------------------------------
  "onboarding.step2.title": {
    en: "Credentials",
    es: "Credenciales",
  },
  "onboarding.step2.subtitle": {
    en: "Help us verify your background. This keeps the network trustworthy.",
    es: "Ayúdanos a verificar tu historial. Esto mantiene la red confiable.",
  },
  "onboarding.step2.licenseNumber": {
    en: "License Number",
    es: "Número de Licencia",
  },
  "onboarding.step2.insuranceProvider": {
    en: "Insurance Provider",
    es: "Proveedor de Seguro",
  },
  "onboarding.step2.w9Status": {
    en: "W-9 Status",
    es: "Estado del W-9",
  },
  "onboarding.step2.w9Filed": {
    en: "W-9 Filed",
    es: "W-9 Presentado",
  },
  "onboarding.step2.w9Pending": {
    en: "W-9 Pending",
    es: "W-9 Pendiente",
  },
  "onboarding.step2.w9NotSure": {
    en: "Not Sure",
    es: "No Estoy Seguro",
  },
  "onboarding.step2.references": {
    en: "References (2)",
    es: "Referencias (2)",
  },
  "onboarding.step2.refName": {
    en: "Reference Name",
    es: "Nombre de Referencia",
  },
  "onboarding.step2.refPhone": {
    en: "Reference Phone",
    es: "Teléfono de Referencia",
  },

  // -------------------------------------------------------------------------
  // Onboarding — Step 3: Wallet Setup
  // -------------------------------------------------------------------------
  "onboarding.step3.title": {
    en: "Wallet Setup",
    es: "Configuración de Billetera",
  },
  "onboarding.step3.subtitle": {
    en: "Your digital wallet in 60 seconds",
    es: "Tu billetera digital en 60 segundos",
  },
  "onboarding.step3.explanation": {
    en: "Your BrixUp Wallet is where you'll receive $BRXU tokens for your work. Think of it like a digital bank account — but faster, with no fees, and you control it completely.",
    es: "Tu Billetera BrixUp es donde recibirás tokens $BRXU por tu trabajo. Piensa en ella como una cuenta bancaria digital — pero más rápida, sin cargos, y tú la controlas completamente.",
  },
  "onboarding.step3.bullet1": {
    en: "Secured by blockchain technology",
    es: "Asegurada por tecnología blockchain",
  },
  "onboarding.step3.bullet2": {
    en: "Only you can access your funds",
    es: "Solo tú puedes acceder a tus fondos",
  },
  "onboarding.step3.bullet3": {
    en: "Convert $BRXU to cash anytime",
    es: "Convierte $BRXU a efectivo en cualquier momento",
  },
  "onboarding.step3.bullet4": {
    en: "No crypto experience needed",
    es: "No necesitas experiencia con criptomonedas",
  },
  "onboarding.step3.createButton": {
    en: "Create My Wallet",
    es: "Crear Mi Billetera",
  },
  "onboarding.step3.creating": {
    en: "Creating your wallet...",
    es: "Creando tu billetera...",
  },
  "onboarding.step3.success": {
    en: "Wallet Created Successfully!",
    es: "¡Billetera Creada Exitosamente!",
  },
  "onboarding.step3.walletAddress": {
    en: "Your Wallet Address",
    es: "Tu Dirección de Billetera",
  },

  // -------------------------------------------------------------------------
  // Onboarding — Step 4: Pick Your First Deal
  // -------------------------------------------------------------------------
  "onboarding.step4.title": {
    en: "Pick Your First Deal",
    es: "Elige Tu Primer Proyecto",
  },
  "onboarding.step4.subtitle": {
    en: "Here are some deals near you that match your trade. Tap one to show interest — no commitment yet.",
    es: "Aquí hay algunos proyectos cerca de ti que coinciden con tu oficio. Toca uno para mostrar interés — sin compromiso aún.",
  },
  "onboarding.step4.interested": {
    en: "I'm Interested",
    es: "Me Interesa",
  },
  "onboarding.step4.selected": {
    en: "Selected!",
    es: "¡Seleccionado!",
  },
  "onboarding.step4.brixRate": {
    en: "$BRXU / hour",
    es: "$BRXU / hora",
  },
  "onboarding.step4.profitShare": {
    en: "Profit Share",
    es: "Participación",
  },
  "onboarding.step4.skip": {
    en: "Skip for now — I'll browse later",
    es: "Omitir por ahora — exploraré después",
  },

  // -------------------------------------------------------------------------
  // Onboarding — Step 5: Welcome
  // -------------------------------------------------------------------------
  "onboarding.step5.title": {
    en: "Welcome to BrixUp!",
    es: "¡Bienvenido a BrixUp!",
  },
  "onboarding.step5.subtitle": {
    en: "You're officially part of the Builder Army.",
    es: "Oficialmente eres parte del Ejército de Constructores.",
  },
  "onboarding.step5.airdrop": {
    en: "1,000 $BRXU has been dropped into your wallet!",
    es: "¡1,000 $BRXU han sido depositados en tu billetera!",
  },
  "onboarding.step5.nextSteps": {
    en: "What's Next",
    es: "Próximos Pasos",
  },
  "onboarding.step5.next1": {
    en: "Browse open deals in your area",
    es: "Explora proyectos abiertos en tu área",
  },
  "onboarding.step5.next2": {
    en: "Complete the $BRXU education module to earn a bonus",
    es: "Completa el módulo educativo de $BRXU para ganar un bono",
  },
  "onboarding.step5.next3": {
    en: "Invite fellow builders and earn referral $BRXU",
    es: "Invita a compañeros constructores y gana $BRXU de referencia",
  },
  "onboarding.step5.goToDashboard": {
    en: "Go to My Dashboard",
    es: "Ir a Mi Panel",
  },
  "onboarding.step5.learnBrix": {
    en: "Learn About $BRXU",
    es: "Aprende Sobre $BRXU",
  },

  // -------------------------------------------------------------------------
  // Learn Page — Section 1: What is $BRXU?
  // -------------------------------------------------------------------------
  "learn.title": {
    en: "Learn About $BRXU",
    es: "Aprende Sobre $BRXU",
  },
  "learn.s1.title": {
    en: "What is $BRXU?",
    es: "¿Qué es $BRXU?",
  },
  "learn.s1.analogy": {
    en: "Think of $BRXU like loyalty points, but they're worth real money and backed by real estate deals.",
    es: "Piensa en $BRXU como puntos de lealtad, pero valen dinero real y están respaldados por proyectos inmobiliarios.",
  },
  "learn.s1.p1": {
    en: "$BRXU is BrixUp's digital token. When you work on a BrixUp construction project, you earn $BRXU based on your hours, trade, and performance. Unlike regular pay, $BRXU also represents your share of the project's future profits.",
    es: "$BRXU es el token digital de BrixUp. Cuando trabajas en un proyecto de construcción de BrixUp, ganas $BRXU basado en tus horas, oficio y rendimiento. A diferencia del pago regular, $BRXU también representa tu participación en las ganancias futuras del proyecto.",
  },
  "learn.s1.p2": {
    en: "Every $BRXU token is tracked on the blockchain, which means it's transparent, secure, and can't be tampered with. You don't need to understand blockchain to use it — BrixUp handles all of that for you.",
    es: "Cada token $BRXU se rastrea en la blockchain, lo que significa que es transparente, seguro y no se puede manipular. No necesitas entender blockchain para usarlo — BrixUp se encarga de todo eso por ti.",
  },

  // -------------------------------------------------------------------------
  // Learn Page — Section 2: Convert to Cash
  // -------------------------------------------------------------------------
  "learn.s2.title": {
    en: "How to Convert $BRXU to Cash",
    es: "Cómo convertir $BRXU a dinero",
  },
  "learn.s2.step1.title": {
    en: "Open Wallet",
    es: "Abre tu Billetera",
  },
  "learn.s2.step1.desc": {
    en: "Open the BrixUp app and tap your wallet balance.",
    es: "Abre la app de BrixUp y toca tu saldo de billetera.",
  },
  "learn.s2.step2.title": {
    en: "Select Convert",
    es: "Selecciona Convertir",
  },
  "learn.s2.step2.desc": {
    en: 'Tap the "Convert to Cash" button to start the process.',
    es: 'Toca el botón "Convertir a Dinero" para iniciar el proceso.',
  },
  "learn.s2.step3.title": {
    en: "Enter Amount",
    es: "Ingresa la Cantidad",
  },
  "learn.s2.step3.desc": {
    en: "Choose how much $BRXU you want to convert. $BRXU converts to USDC at a fixed rate.",
    es: "Elige cuántos $BRXU quieres convertir. $BRXU se convierte a USDC a una tasa fija.",
  },
  "learn.s2.step4.title": {
    en: "Money Arrives",
    es: "Llega tu Dinero",
  },
  "learn.s2.step4.desc": {
    en: "USDC is deposited to your linked bank account via ACH in 1-2 business days.",
    es: "USDC se deposita en tu cuenta bancaria vinculada vía ACH en 1-2 días hábiles.",
  },

  // -------------------------------------------------------------------------
  // Learn Page — Section 3: Profit Share Calculator
  // -------------------------------------------------------------------------
  "learn.s3.title": {
    en: "Understanding Your Profit Share",
    es: "Entendiendo tu participación",
  },
  "learn.s3.desc": {
    en: "See how your work translates to earnings. This is an estimate based on typical BrixUp deals.",
    es: "Mira cómo tu trabajo se traduce en ganancias. Esta es una estimación basada en proyectos típicos de BrixUp.",
  },
  "learn.s3.yourTrade": {
    en: "Your Trade",
    es: "Tu Oficio",
  },
  "learn.s3.hoursPerWeek": {
    en: "Hours per Week",
    es: "Horas por Semana",
  },
  "learn.s3.weeks": {
    en: "Weeks on Project",
    es: "Semanas en el Proyecto",
  },
  "learn.s3.baseRate": {
    en: "Base $BRXU Rate",
    es: "Tasa Base de $BRXU",
  },
  "learn.s3.totalBrix": {
    en: "Total $BRXU Earned",
    es: "Total de $BRXU Ganados",
  },
  "learn.s3.cashValue": {
    en: "Estimated Cash Value",
    es: "Valor Estimado en Efectivo",
  },
  "learn.s3.profitShare": {
    en: "Estimated Profit Share Bonus",
    es: "Bono Estimado de Participación",
  },
  "learn.s3.totalEarnings": {
    en: "Total Estimated Earnings",
    es: "Ganancias Totales Estimadas",
  },
  "learn.s3.calculate": {
    en: "Calculate",
    es: "Calcular",
  },
  "learn.s3.perHour": {
    en: "/ hour",
    es: "/ hora",
  },
  "learn.s3.disclaimer": {
    en: "* Estimates are based on average BrixUp deal structures. Actual earnings depend on project specifics and market conditions.",
    es: "* Las estimaciones se basan en estructuras de proyectos promedio de BrixUp. Las ganancias reales dependen de los detalles del proyecto y las condiciones del mercado.",
  },

  // -------------------------------------------------------------------------
  // Learn Page — Section 4: FAQ
  // -------------------------------------------------------------------------
  "learn.faq.title": {
    en: "Frequently Asked Questions",
    es: "Preguntas Frecuentes",
  },
  "learn.faq.q1.q": {
    en: "Do I need crypto experience to use $BRXU?",
    es: "¿Necesito experiencia con criptomonedas para usar $BRXU?",
  },
  "learn.faq.q1.a": {
    en: "No! BrixUp handles all the technical details. You earn $BRXU, and when you're ready, you tap a button to convert it to cash in your bank account. It's as simple as using Venmo or Cash App.",
    es: "¡No! BrixUp maneja todos los detalles técnicos. Ganas $BRXU, y cuando estés listo, tocas un botón para convertirlo en efectivo en tu cuenta bancaria. Es tan simple como usar Venmo o Cash App.",
  },
  "learn.faq.q2.q": {
    en: "How soon can I convert $BRXU to cash?",
    es: "¿Qué tan pronto puedo convertir $BRXU a efectivo?",
  },
  "learn.faq.q2.a": {
    en: "You can convert $BRXU to USDC at any time. The ACH transfer to your bank takes 1-2 business days. Some $BRXU may have a vesting period tied to project milestones.",
    es: "Puedes convertir $BRXU a USDC en cualquier momento. La transferencia ACH a tu banco toma 1-2 días hábiles. Algunos $BRXU pueden tener un período de adquisición vinculado a hitos del proyecto.",
  },
  "learn.faq.q3.q": {
    en: "What's a Brix Score and why does it matter?",
    es: "¿Qué es el Puntaje Brix y por qué importa?",
  },
  "learn.faq.q3.a": {
    en: "Your Brix Score is like a credit score for builders. It's based on project completions, quality ratings, and reliability. Higher scores unlock premium deals with better pay and larger profit shares.",
    es: "Tu Puntaje Brix es como un puntaje crediticio para constructores. Se basa en proyectos completados, calificaciones de calidad y confiabilidad. Puntajes más altos desbloquean proyectos premium con mejor pago y mayores participaciones en ganancias.",
  },
  "learn.faq.q4.q": {
    en: "Do I have to pay taxes on $BRXU?",
    es: "¿Tengo que pagar impuestos sobre $BRXU?",
  },
  "learn.faq.q4.a": {
    en: "Yes, earnings are taxable income. BrixUp provides year-end tax documents (1099) to make filing easy. We recommend consulting a tax professional for your specific situation.",
    es: "Sí, las ganancias son ingresos sujetos a impuestos. BrixUp proporciona documentos fiscales de fin de año (1099) para facilitar la declaración. Recomendamos consultar a un profesional de impuestos para tu situación específica.",
  },
  "learn.faq.q5.q": {
    en: "Can I lose my $BRXU?",
    es: "¿Puedo perder mis $BRXU?",
  },
  "learn.faq.q5.a": {
    en: "Your $BRXU are secured in your wallet on the blockchain. As long as you maintain access to your BrixUp account, your tokens are safe. BrixUp also provides recovery options if you lose access.",
    es: "Tus $BRXU están asegurados en tu billetera en la blockchain. Mientras mantengas acceso a tu cuenta BrixUp, tus tokens están seguros. BrixUp también proporciona opciones de recuperación si pierdes acceso.",
  },
  "learn.faq.q6.q": {
    en: "What happens to my $BRXU if a project fails?",
    es: "¿Qué pasa con mis $BRXU si un proyecto falla?",
  },
  "learn.faq.q6.a": {
    en: "Your base $BRXU earnings for hours worked are yours to keep regardless. Profit share $BRXU are tied to project outcomes, but BrixUp's deal vetting process minimizes risk.",
    es: "Tus ganancias base de $BRXU por horas trabajadas son tuyas sin importar qué. Los $BRXU de participación en ganancias están vinculados a los resultados del proyecto, pero el proceso de evaluación de BrixUp minimiza el riesgo.",
  },
  "learn.faq.q7.q": {
    en: "How is BrixUp different from a regular construction job?",
    es: "¿En qué se diferencia BrixUp de un trabajo de construcción regular?",
  },
  "learn.faq.q7.a": {
    en: "In a regular job, you get your hourly rate and that's it. With BrixUp, you earn your rate PLUS $BRXU tokens that give you profit sharing in the actual real estate deal. You become a stakeholder, not just a laborer.",
    es: "En un trabajo regular, recibes tu tarifa por hora y eso es todo. Con BrixUp, ganas tu tarifa MÁS tokens $BRXU que te dan participación en el proyecto inmobiliario real. Te conviertes en un participante, no solo un trabajador.",
  },
  "learn.faq.q8.q": {
    en: "Is BrixUp available in my area?",
    es: "¿BrixUp está disponible en mi área?",
  },
  "learn.faq.q8.a": {
    en: "BrixUp is currently launching in major metro areas across the US, with plans to expand nationwide. Sign up to get notified when deals are available in your area.",
    es: "BrixUp se está lanzando actualmente en las principales áreas metropolitanas de los EE.UU., con planes de expandirse a nivel nacional. Regístrate para recibir notificaciones cuando haya proyectos disponibles en tu área.",
  },

  // -------------------------------------------------------------------------
  // Onboarding — Progress bar step names
  // -------------------------------------------------------------------------
  "onboarding.progress.step1": {
    en: "Info",
    es: "Info",
  },
  "onboarding.progress.step2": {
    en: "Credentials",
    es: "Credenciales",
  },
  "onboarding.progress.step3": {
    en: "Wallet",
    es: "Billetera",
  },
  "onboarding.progress.step4": {
    en: "Deals",
    es: "Proyectos",
  },
  "onboarding.progress.step5": {
    en: "Welcome",
    es: "Bienvenida",
  },

  // -------------------------------------------------------------------------
  // Sample deals for onboarding step 4
  // -------------------------------------------------------------------------
  "deal.1.title": {
    en: "Midtown Mixed-Use Development",
    es: "Desarrollo de Uso Mixto en Midtown",
  },
  "deal.1.location": {
    en: "Atlanta, GA",
    es: "Atlanta, GA",
  },
  "deal.1.trade": {
    en: "Electrical",
    es: "Electricidad",
  },
  "deal.1.duration": {
    en: "8-12 weeks",
    es: "8-12 semanas",
  },
  "deal.2.title": {
    en: "Westside Townhome Build",
    es: "Construcción de Townhomes en Westside",
  },
  "deal.2.location": {
    en: "Houston, TX",
    es: "Houston, TX",
  },
  "deal.2.trade": {
    en: "Framing",
    es: "Armazón",
  },
  "deal.2.duration": {
    en: "6-10 weeks",
    es: "6-10 semanas",
  },
  "deal.3.title": {
    en: "Brickell Condo Renovation",
    es: "Renovación de Condominio en Brickell",
  },
  "deal.3.location": {
    en: "Miami, FL",
    es: "Miami, FL",
  },
  "deal.3.trade": {
    en: "General Labor",
    es: "Trabajo General",
  },
  "deal.3.duration": {
    en: "4-6 weeks",
    es: "4-6 semanas",
  },

  // -------------------------------------------------------------------------
  // App Shell — Navigation & Header
  // -------------------------------------------------------------------------
  "nav.dashboard": { en: "Dashboard", es: "Panel" },
  "nav.marketplace": { en: "Marketplace", es: "Mercado" },
  "nav.builder": { en: "Builder", es: "Constructor" },
  "nav.dealFinder": { en: "Deal Finder", es: "Buscador" },
  "nav.wallet": { en: "Wallet", es: "Billetera" },
  "nav.agreements": { en: "Agreements", es: "Acuerdos" },
  "nav.settings": { en: "Settings", es: "Ajustes" },
  "nav.admin": { en: "Admin", es: "Admin" },
  "header.search": { en: "Search deals, builders, locations...", es: "Buscar proyectos, constructores, ubicaciones..." },
  "header.notifications": { en: "Notifications", es: "Notificaciones" },
  "header.markAllRead": { en: "Mark all read", es: "Marcar todo leído" },
  "header.noNotifications": { en: "No notifications", es: "Sin notificaciones" },
  "header.loading": { en: "Loading...", es: "Cargando..." },
  "header.signOut": { en: "Sign out", es: "Cerrar sesión" },

  // -------------------------------------------------------------------------
  // Settings Page
  // -------------------------------------------------------------------------
  "settings.title": { en: "Settings", es: "Ajustes" },
  "settings.subtitle": { en: "Manage your account and preferences", es: "Administra tu cuenta y preferencias" },
  "settings.saved": { en: "Changes saved successfully!", es: "¡Cambios guardados exitosamente!" },
  "settings.profile": { en: "Profile", es: "Perfil" },
  "settings.fullName": { en: "Full Name", es: "Nombre Completo" },
  "settings.email": { en: "Email Address", es: "Correo Electrónico" },
  "settings.emailCantChange": { en: "Email cannot be changed", es: "El correo no se puede cambiar" },
  "settings.phone": { en: "Phone Number", es: "Número de Teléfono" },
  "settings.saveChanges": { en: "Save Changes", es: "Guardar Cambios" },
  "settings.saving": { en: "Saving...", es: "Guardando..." },
  "settings.uploadPhoto": { en: "Upload Photo", es: "Subir Foto" },
  "settings.uploading": { en: "Uploading...", es: "Subiendo..." },
  "settings.photoHint": { en: "JPG, PNG or GIF. Max 2MB.", es: "JPG, PNG o GIF. Máx 2MB." },
  "settings.kyc": { en: "KYC Verification", es: "Verificación KYC" },
  "settings.kycIdentity": { en: "Identity Verification", es: "Verificación de Identidad" },
  "settings.kycVerified": { en: "Your identity has been verified", es: "Tu identidad ha sido verificada" },
  "settings.kycPending": { en: "Verification pending", es: "Verificación pendiente" },
  "settings.verified": { en: "Verified", es: "Verificado" },
  "settings.startVerification": { en: "Start Verification", es: "Iniciar Verificación" },
  "settings.notifications": { en: "Notification Preferences", es: "Preferencias de Notificaciones" },
  "settings.emailNotif": { en: "Email Notifications", es: "Notificaciones por Email" },
  "settings.emailNotifDesc": { en: "Deal updates, yield payouts, and account alerts", es: "Actualizaciones de proyectos, pagos de rendimiento y alertas de cuenta" },
  "settings.smsNotif": { en: "SMS Notifications", es: "Notificaciones por SMS" },
  "settings.smsNotifDesc": { en: "Security alerts and important transaction confirmations", es: "Alertas de seguridad y confirmaciones de transacciones importantes" },
  "settings.pushNotif": { en: "Push Notifications", es: "Notificaciones Push" },
  "settings.pushNotifDesc": { en: "Real-time updates on milestones and draw schedules", es: "Actualizaciones en tiempo real sobre hitos y calendarios de retiro" },
  "settings.connectedWallet": { en: "Connected Wallet", es: "Billetera Conectada" },
  "settings.noWallet": { en: "No wallet connected", es: "Billetera no conectada" },
  "settings.noWalletDesc": { en: "Connect your wallet to see your on-chain address", es: "Conecta tu billetera para ver tu dirección on-chain" },
  "settings.connectWallet": { en: "Connect Wallet", es: "Conectar Billetera" },
  "settings.connecting": { en: "Connecting...", es: "Conectando..." },
  "settings.copy": { en: "Copy", es: "Copiar" },
  "settings.copied": { en: "Copied", es: "Copiado" },
  "settings.language": { en: "Language", es: "Idioma" },
  "settings.theme": { en: "Theme", es: "Tema" },
  "settings.themeDark": { en: "Dark", es: "Oscuro" },
  "settings.themeLight": { en: "Light", es: "Claro" },
  "settings.themeAuto": { en: "Auto", es: "Auto" },
  "settings.dangerZone": { en: "Danger Zone", es: "Zona de Peligro" },
  "settings.dangerDesc": { en: "These actions are irreversible. Please proceed with caution.", es: "Estas acciones son irreversibles. Procede con precaución." },
  "settings.disconnectWallet": { en: "Disconnect Wallet", es: "Desconectar Billetera" },
  "settings.deleteAccount": { en: "Delete Account", es: "Eliminar Cuenta" },

  // -------------------------------------------------------------------------
  // Dashboard
  // -------------------------------------------------------------------------
  "dashboard.goodMorning": { en: "Good morning", es: "Buenos días" },
  "dashboard.goodAfternoon": { en: "Good afternoon", es: "Buenas tardes" },
  "dashboard.goodEvening": { en: "Good evening", es: "Buenas noches" },
  "dashboard.totalBalance": { en: "Total Balance", es: "Saldo Total" },
  "dashboard.activeDeals": { en: "Active Deals", es: "Proyectos Activos" },
  "dashboard.totalYield": { en: "Total Yield", es: "Rendimiento Total" },
  "dashboard.portfolioValue": { en: "Portfolio Value", es: "Valor del Portafolio" },
  "dashboard.recentTransactions": { en: "Recent Transactions", es: "Transacciones Recientes" },
  "dashboard.viewAll": { en: "View All", es: "Ver Todo" },
  "dashboard.investments": { en: "Investments", es: "Inversiones" },

  // -------------------------------------------------------------------------
  // Marketplace
  // -------------------------------------------------------------------------
  "marketplace.search": { en: "State, County, City or Zip", es: "Estado, Condado, Ciudad o Código Postal" },
  "marketplace.dealsFound": { en: "deals found", es: "proyectos encontrados" },
  "marketplace.deals": { en: "deals", es: "proyectos" },
  "marketplace.newest": { en: "Newest First", es: "Más Recientes" },
  "marketplace.highestRoi": { en: "Highest ROI", es: "Mayor ROI" },
  "marketplace.mostFunded": { en: "Most Funded", es: "Más Financiados" },
  "marketplace.priceLow": { en: "Price: Low to High", es: "Precio: Menor a Mayor" },
  "marketplace.priceHigh": { en: "Price: High to Low", es: "Precio: Mayor a Menor" },
  "marketplace.homeType": { en: "Home Type", es: "Tipo de Propiedad" },
  "marketplace.price": { en: "Price", es: "Precio" },
  "marketplace.bedsBaths": { en: "Beds / Baths", es: "Habitaciones / Baños" },
  "marketplace.available": { en: "Available", es: "Disponible" },
  "marketplace.clear": { en: "Clear", es: "Limpiar" },
  "marketplace.noDeals": { en: "No deals found", es: "No se encontraron proyectos" },
  "marketplace.noDealsHint": { en: "Try adjusting your filters or search query", es: "Intenta ajustar tus filtros o búsqueda" },
  "marketplace.dealTypes": { en: "Deal Types", es: "Tipos de Proyecto" },
  "marketplace.loadingMap": { en: "Loading map...", es: "Cargando mapa..." },
  "marketplace.mapError": { en: "Map failed to load. Check your connection and refresh.", es: "El mapa no se pudo cargar. Verifica tu conexión y actualiza." },
};

/**
 * Translate helper — returns the translated string for a given key and language.
 * Falls back to the English string if the key exists but the language is missing.
 * Returns the key itself (wrapped in brackets) if the key is not found.
 */
export function t(key: string, lang: Lang): string {
  const entry = dictionary[key];
  if (!entry) return `[${key}]`;
  return entry[lang] ?? entry.en ?? `[${key}]`;
}

export default dictionary;
