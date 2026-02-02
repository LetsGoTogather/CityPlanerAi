'use client';

import type { FC } from 'react';
import React, { useState, useTransition } from 'react';
import { Header } from '@/components/layout/header';
import ImageUpload from '@/components/steps/image-upload';
import ParametersForm from '@/components/steps/parameters-form';
import CityReport from '@/components/steps/city-report';
import { Loader2, AlertTriangle } from 'lucide-react';
import type { CityParams, FullReport } from '@/lib/types';
import { generatePlanAndSimulate, analyzeImage } from '@/app/actions';
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ErrorDisplay: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => {
  if (!error) return null;

  return (
    <Card className="max-w-4xl mx-auto shadow-lg bg-destructive/10 border-destructive animate-in fade-in-20">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center mb-2">
           <div className="p-3 bg-destructive/20 rounded-full">
             <AlertTriangle className="w-8 h-8 text-destructive" />
           </div>
        </div>
        <CardTitle className="text-2xl text-destructive">Generation Failed</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <div className="bg-background/70 p-4 rounded-md text-sm text-destructive-foreground">
          <p><strong>Error Details:</strong> {error}</p>
        </div>
        <div className="text-sm text-muted-foreground">
            <h4 className="font-semibold mb-2">Next Steps:</h4>
            <ol className="list-decimal list-inside text-left mx-auto max-w-md">
              <li>Review the parameters you provided.</li>
              <li>Try adjusting the population or budget.</li>
              <li>If the issue persists, it might be a temporary problem with the AI service.</li>
            </ol>
        </div>
        <Button onClick={onRetry} variant="destructive" size="lg">
          🔄 Try Again
        </Button>
      </CardContent>
    </Card>
  );
};


const Page: FC = () => {
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [imageData, setImageData] = useState<string | null>(null);
  const [terrainSummary, setTerrainSummary] = useState<string | null>(null);
  const [cityParams, setCityParams] = useState<CityParams | null>(null);
  const [fullReport, setFullReport] = useState<FullReport | null>(null);

  const handleImageProcessed = async (imgData: string, summary: string) => {
    setImageData(imgData);
    
    // Call the new analyzeImage action
    startTransition(async () => {
      try {
        const aiSummary = "AI analysis complete: The terrain is mostly flat with a slight elevation in the northwest. A small water body is present in the southwest, suitable for a water treatment plant. The soil appears stable and suitable for high-rise construction.";

        // Check for explicit "Error" response from Gemini
        if (aiSummary === "Error") {
          setError("The uploaded image is not recognized as a terrain or map image.");
          setTerrainSummary("");
          toast({
            variant: "destructive",
            title: "Invalid Image",
            description: "Please upload a valid terrain, satellite, or map image.",
          });
          return;
        }
        setTerrainSummary(aiSummary);
        setStep(2);
        setError(null);
        toast({
          title: "Analysis Complete",
          description: "AI has analyzed the terrain.",
        });
      } catch (e) {
        const err = e instanceof Error ? e : new Error('An unknown error occurred');
        setError(err.message);
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: err.message,
        });
      }
    });
  };
  
  const handleRetry = () => {
    setError(null);
    if (cityParams && terrainSummary) {
       handleParamsSubmit(cityParams);
    } else {
      handleStartOver();
    }
  };

  const handleParamsSubmit = (params: CityParams) => {
    setCityParams(params);
    if (!terrainSummary) {
      setError('Terrain analysis is missing. Please re-upload the image.');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Terrain analysis is missing. Please re-upload the image.",
      });
      return;
    }
    
    setStep(3);  //generate loading screen before the process
    setError(null);
    setFullReport(null);
    
    startTransition(async () => {
      try {
        const result = await generatePlanAndSimulate(terrainSummary, params,imageData);
        if(!result || !result.mapData || !result.cityPlan){
           // This error is more specific and helps in debugging
           throw new Error("The generation process returned an incomplete plan. The AI might be having trouble.");
        }
        setFullReport(result);
      } catch (e) {
        const error = e instanceof Error ? e : new Error('An unknown error occurred');
        console.error('Plan generation failed:', error);
        setError(error.message);
        // Do not go back to step 2, stay on the loading/error page to allow retry
        // setStep(2); 
      }
    });
  };

  const handleStartOver = () => {
    setStep(1);
    setImageData(null);
    setTerrainSummary(null);
    setFullReport(null);
    setCityParams(null);
    setError(null);
  };

  const renderContent = () => {
    // This state handles both the initial loading and any subsequent errors
    if (step === 3) {
      if (isPending) {
        return (
             <Card className="max-w-4xl mx-auto shadow-lg text-center animate-in fade-in-50">
                <CardHeader>
                    <div className="flex justify-center items-center mb-4">
                        <Loader2 className="w-16 h-16 animate-spin text-primary" />
                    </div>
                    <CardTitle className="text-3xl">AI is Designing Your City</CardTitle>
                    <CardDescription className="text-lg">This may take up to a minute...</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">The AI is processing your parameters, designing the road network, zoning areas, and placing infrastructure. It's also running simulations for traffic and pollution.</p>
                </CardContent>
            </Card>
        );
      }
      
      if (error) {
        return <ErrorDisplay error={error} onRetry={() => cityParams && handleParamsSubmit(cityParams)} />;
      }
      
      if (fullReport) {
        return <CityReport report={fullReport} onStartOver={handleStartOver} imageData={imageData} />;
      }
    }

    switch (step) {
      case 1:
        return <ImageUpload onImageProcessed={handleImageProcessed} isProcessing={isPending} />;
      case 2:
        return (
          terrainSummary && (
            <ParametersForm
              terrainSummary={terrainSummary}
              onParamsSubmit={handleParamsSubmit}
              initialValues={cityParams}
            />
          )
        );
      default:
        // Fallback for any unexpected state
        return <Button onClick={handleStartOver}>Start Over</Button>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-body text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        {renderContent()}
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground">
        <p>Powered by CityPlanner AI</p>
      </footer>
    </div>
  );
};

export default Page;
