'use client';

import React, { useState, useTransition } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Loader2, UploadCloud, Satellite } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"

interface ImageUploadProps {
  onImageProcessed: (imageData: string, summary: string) => void;
  isProcessing: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageProcessed, isProcessing }) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const { toast } = useToast();

  const placeholderImage = PlaceHolderImages.find(img => img.id === 'initial-land');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit for Gemini API
         toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload an image smaller than 4MB.",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setUploadedImage(imageData);
      };
      reader.readAsDataURL(file);
      setFileName(file.name);
    }
  };

  const handleAnalysis = () => {
    if (!uploadedImage) {
      toast({
        variant: "destructive",
        title: "No image selected",
        description: "Please upload an image before starting the analysis.",
      });
      return;
    }
    // The summary here is just a placeholder, the real analysis happens in the action
    onImageProcessed(uploadedImage, "Initial terrain data from image.");
  };

  return (
    <Card className="max-w-4xl mx-auto shadow-lg animate-in fade-in-50">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center mb-4">
           <div className="p-3 bg-primary/10 rounded-full">
             <Satellite className="w-8 h-8 text-primary" />
           </div>
        </div>
        <CardTitle className="text-3xl font-headline">AI Urban Planning System</CardTitle>
        <CardDescription className="text-lg">
          Start by uploading a satellite image of an empty plot of land.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="w-full h-[400px] rounded-lg overflow-hidden border-2 border-dashed border-border flex items-center justify-center bg-muted/50">
          {uploadedImage || placeholderImage ? (
            <Image
              src={uploadedImage || placeholderImage!.imageUrl}
              alt={uploadedImage ? "Uploaded Land" : placeholderImage!.description}
              width={1200}
              height={800}
              className="object-contain w-auto h-full"
              data-ai-hint={placeholderImage?.imageHint}
            />
          ) : (
            <div className="text-center text-muted-foreground">
              <UploadCloud className="w-12 h-12 mx-auto" />
              <p>Image preview will appear here</p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-grow w-full">
            <Input
              id="image-upload"
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={isProcessing}
            />
            <Button asChild variant="outline" className="w-full cursor-pointer">
              <label htmlFor="image-upload" className="flex items-center justify-center gap-2 cursor-pointer">
                <UploadCloud className="w-5 h-5" />
                <span>{fileName || 'Choose Satellite Image'}</span>
              </label>
            </Button>
          </div>
          <Button
            onClick={handleAnalysis}
            disabled={!uploadedImage || isProcessing}
            className="w-full sm:w-auto"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Start AI Analysis →'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageUpload;
