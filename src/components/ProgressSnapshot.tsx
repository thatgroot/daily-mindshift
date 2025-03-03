
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BarChart, Calendar, CheckCircle, Download, Image, Share2, Trophy, AlertTriangle } from 'lucide-react';
import { useHabits } from '@/contexts/HabitContext';
import ProgressRing from '@/components/ProgressRing';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';

const ProgressSnapshot = () => {
  const [open, setOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const snapshotRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { habits, getCompletionStatus } = useHabits();
  
  const { completed, total } = getCompletionStatus();
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  // Find the habit with the longest streak
  const topHabit = habits.reduce((prev, current) => 
    (current.streak > prev.streak) ? current : prev, 
    { streak: 0, name: '' } as any);
  
  const generateSnapshot = async () => {
    setGenerating(true);
    
    try {
      if (snapshotRef.current) {
        const canvas = await html2canvas(snapshotRef.current, {
          backgroundColor: null,
          scale: 2,
        });
        
        const url = canvas.toDataURL('image/png');
        setImageUrl(url);
      }
    } catch (error) {
      console.error('Error generating snapshot:', error);
      toast({
        title: "Generation Failed",
        description: "There was an error creating your snapshot.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };
  
  const downloadSnapshot = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `habits-progress-${format(new Date(), 'yyyy-MM-dd')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Snapshot Downloaded",
        description: "Your progress snapshot has been saved!",
      });
    }
  };
  
  const shareSnapshot = async () => {
    if (!imageUrl) return;
    
    if (navigator.share) {
      try {
        // Convert base64 to blob
        const blob = await fetch(imageUrl).then(r => r.blob());
        const file = new File([blob], "habit-progress.png", { type: "image/png" });
        
        await navigator.share({
          title: 'My Habit Progress',
          text: 'Check out my progress with Daily Routines!',
          files: [file],
        });
        
        toast({
          title: "Shared Successfully",
          description: "Your progress has been shared!",
        });
      } catch (error) {
        console.error('Error sharing:', error);
        if ((error as Error).name !== 'AbortError') {
          toast({
            title: "Sharing Failed",
            description: "There was an error sharing your progress.",
            variant: "destructive",
          });
        }
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      toast({
        title: "Sharing Not Supported",
        description: "Your browser doesn't support direct sharing. Please use the download option instead.",
      });
    }
  };
  
  return (
    <>
      <Button 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={() => setOpen(true)}
      >
        <Share2 className="h-4 w-4" /> Share Progress
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Your Progress</DialogTitle>
            <DialogDescription>
              Create and share a snapshot of your habit progress.
            </DialogDescription>
          </DialogHeader>
          
          {!imageUrl ? (
            <>
              <div className="border rounded-lg p-4 overflow-hidden" ref={snapshotRef}>
                <div className="text-center mb-3">
                  <h3 className="text-xl font-bold">My Habit Progress</h3>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(), 'PPP')}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" /> Daily Completion
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2 pt-0">
                      <div className="flex justify-center">
                        <ProgressRing 
                          percentage={completionRate} 
                          strokeWidth={5}
                          radius={40}
                        />
                      </div>
                      <p className="text-center mt-2 text-sm font-medium">
                        {completed} of {total} habits completed today
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-amber-500" /> Top Streak
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2 pt-0">
                      {topHabit?.name ? (
                        <>
                          <p className="text-center text-3xl font-bold">
                            {topHabit.streak}
                          </p>
                          <p className="text-center text-sm font-medium truncate">
                            days: {topHabit.name}
                          </p>
                        </>
                      ) : (
                        <p className="text-center text-sm">Start your first habit streak!</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex items-center justify-center gap-1">
                  <p className="text-xs text-muted-foreground">Tracked with</p>
                  <span className="font-bold text-xs">Daily Routines</span>
                </div>
              </div>
              
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Privacy Note</AlertTitle>
                <AlertDescription>
                  This snapshot only includes summary data and doesn't expose sensitive habit details.
                </AlertDescription>
              </Alert>
              
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  variant="secondary"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={generateSnapshot}
                  disabled={generating}
                  className="gap-2"
                >
                  {generating ? (
                    <>Generating...</>
                  ) : (
                    <>
                      <Image className="h-4 w-4" /> Generate Snapshot
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <div className="border rounded-lg overflow-hidden">
                <img src={imageUrl} alt="Progress Snapshot" className="w-full" />
              </div>
              
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  className="sm:flex-1 gap-2"
                  onClick={downloadSnapshot}
                >
                  <Download className="h-4 w-4" /> Download
                </Button>
                <Button
                  className="sm:flex-1 gap-2"
                  onClick={shareSnapshot}
                >
                  <Share2 className="h-4 w-4" /> Share
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProgressSnapshot;
