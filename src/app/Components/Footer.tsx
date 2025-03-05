export default function Footer() {
    return (

        <footer className="w-full py-6 bg-gradient-to-r from-blue-600 to-pink-500 text-white mt-10">
            <div className="mx-auto px-4 text-center">
                <p className="text-sm">
                    © {new Date().getFullYear()} HealthCare AI. All rights reserved.
                </p>
            </div>
        </footer>
    )
}