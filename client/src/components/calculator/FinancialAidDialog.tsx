import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dialog, DialogTitle, DialogContent, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { CostChart } from './CostChart';
import { useFinancialAid } from '../../hooks/useFinancialAid';
import { useUserStore } from '../../store/useUserStore';

interface FinancialAidDialogProps {
  universityId: string;
  isOpen: boolean;
  onClose: () => void;
  stickerPrice?: number; // optional, maintained for backward compatibility
}

type FormValues = {
  income: number;
  gpa: number;
  sat?: number;
  inState: boolean;
};

export const FinancialAidDialog: React.FC<FinancialAidDialogProps> = ({ universityId, isOpen, onClose }) => {
  const user = useUserStore((s) => s.profile);
  const { register, handleSubmit, control } = useForm<FormValues>({
    defaultValues: {
      income: user?.familyIncome || undefined,
      gpa: user?.gpa || undefined,
      sat: user?.satScore || undefined,
      inState: false,
    },
  });

  const { mutate, data, isPending, reset: resetMutation } = useFinancialAid();

  const onSubmit = (values: FormValues) => {
    mutate({
      universityId,
      income: Number(values.income),
      gpa: Number(values.gpa),
      sat: values.sat ? Number(values.sat) : undefined,
      inState: values.inState,
    });
  };

  const handleClose = () => {
    resetMutation();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogTitle>Financial Aid Estimator</DialogTitle>
        
        {!data && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Family Income ($)</label>
                <Input type="number" {...register('income', { required: true, min: 0 })} placeholder="80000" />
              </div>
              <div>
                <label className="text-sm font-medium">GPA</label>
                <Input type="number" step="0.01" {...register('gpa', { required: true, max: 4 })} placeholder="3.8" />
              </div>
              <div>
                <label className="text-sm font-medium">SAT Score (Optional)</label>
                <Input type="number" {...register('sat')} placeholder="1350" />
              </div>
              <div className="flex items-center pt-6">
                <Controller
                  name="inState"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="h-4 w-4"
                      />
                      <label className="text-sm">I live in this state</label>
                    </div>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Calculating...' : 'Calculate Net Price'}
              </Button>
            </DialogFooter>
          </form>
        )}

        {data && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-sm text-muted-foreground uppercase">Estimated Net Price</span>
              <div className="text-4xl font-bold text-primary mt-1">${Math.round(data.netPrice).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-2">{data.breakdown}</p>
            </div>

            <CostChart stickerPrice={data.grossCost} netPrice={data.netPrice} aid={data.totalAid} />

            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm border-t pt-4">
              <div className="flex justify-between"><span>Tuition</span><span>${data.tuition.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Housing</span><span>${data.housing.toLocaleString()}</span></div>
              <div className="flex justify-between font-bold pt-2 border-t"><span>Gross Cost</span><span>${data.grossCost.toLocaleString()}</span></div>
              
              <div className="col-span-2 my-2" />

              <div className="flex justify-between text-green-600"><span>Grants (Need)</span><span>-${Math.round(data.needAid).toLocaleString()}</span></div>
              <div className="flex justify-between text-green-600"><span>Scholarships (Merit)</span><span>-${Math.round(data.meritAid).toLocaleString()}</span></div>
              <div className="flex justify-between font-bold pt-2 border-t"><span>Total Aid</span><span className="text-green-600">-${Math.round(data.totalAid).toLocaleString()}</span></div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={resetMutation}>Recalculate</Button>
              <Button onClick={handleClose}>Close</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
