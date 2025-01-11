import { APP_NAME } from '@/constants';
import { useAppSelector } from '@/app/hooks';
import ParamsList from '@/components/layout/params/Params';
import ButtonImport from '@/components/ui/buttons/ButtonImport';
import ButtonExport from '@/components/ui/buttons/ButtonExport';
import ButtonClear from '@/components/ui/buttons/ButtonClear';
import logo from '@/assets/logo.png';

const OptionsApp = () => {
  const { data: params } = useAppSelector((state) => state.params);

  return (
    <div className="w-full max-w-xl ml-auto mr-auto pl-4 pr-4 pb-4">
      <header className="py-6">
        <div className="flex gap-3 items-center">
          <img src={logo} width="48" height="48" alt={`${APP_NAME} logo`} />
          <span className="text-3xl">{APP_NAME}</span>
        </div>
      </header>
      <main className="text-sm rounded-lg dark:border dark:border-gray-700">
        <h1 className="font-bold mb-4 text-lg">Manage URL Parameters</h1>
        <div>
          <div className="flex gap-2">
            <ButtonImport />
            {params?.length > 0 && (
              <>
                <ButtonExport data={params} />
                <ButtonClear />
              </>
            )}
          </div>
        </div>
        {params?.length > 0 && (
          <div className="mt-6">
            <ParamsList clickable={false} />
          </div>
        )}
      </main>
    </div>
  );
};

export default OptionsApp;
