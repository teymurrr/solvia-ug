import MainLayout from "@/components/MainLayout";
import { useLanguage } from "@/hooks/useLanguage";

const Impressum = () => {
  const { t } = useLanguage();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">{t?.impressum?.title || "Impressum"}</h1>
        <p className="text-muted-foreground mb-8">{t?.impressum?.subtitle || "Legal Information"}</p>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">{t?.impressum?.companyInfo?.title || "Company Information"}</h2>
            <div className="bg-card p-6 rounded-lg border">
              <p className="font-semibold text-lg mb-2">{t?.impressum?.companyInfo?.name || "Solvia FlexKapG"}</p>
              <p className="text-muted-foreground">{t?.impressum?.companyInfo?.registrationNumber || "FN 646976k"}</p>
              <p className="text-muted-foreground mt-4">{t?.impressum?.companyInfo?.address || "Schmiedingerstraße 16"}</p>
              <p className="text-muted-foreground">
                {t?.impressum?.companyInfo?.postalCode || "5020"}, {t?.impressum?.companyInfo?.city || "Salzburg"}
              </p>
              <p className="text-muted-foreground">{t?.impressum?.companyInfo?.country || "Austria"}</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{t?.impressum?.contact?.title || "Contact"}</h2>
            <div className="bg-card p-6 rounded-lg border">
              <p className="mb-2">
                <span className="font-medium">{t?.impressum?.contact?.email || "Email"}:</span>{" "}
                <a href="mailto:David.rehrl@thesolvia.com" className="text-primary hover:underline">
                  David.rehrl@thesolvia.com
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{t?.impressum?.legal?.title || "Legal Disclaimer"}</h2>
            <div className="bg-card p-6 rounded-lg border">
              <p className="text-muted-foreground leading-relaxed">
                {t?.impressum?.legal?.content || "The information provided on this website is for general informational purposes only."}
              </p>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default Impressum;
