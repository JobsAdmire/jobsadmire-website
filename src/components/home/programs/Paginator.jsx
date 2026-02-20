import { Typography } from 'antd'
import { PrimaryButton} from '@components/core/buttons'

const Paginator = ({ currentPage, totalPages, onNavigateForward, onNavigateBackward, isLoading }) => {
  return (
    <div className="w-full">
      {
        isLoading
          ? <p className="w-full py-5 text-center">Loading...</p>
          : (
            <div className="flex justify-between items-center w-full p-5 max-md:px-0 text-sm">
              <div className="flex justify-start items-center flex-1">
                {currentPage > 1 && <PrimaryButton text="Previous Page" onClick={onNavigateBackward}/>}
              </div>
              <Typography.Text className="text-center">{currentPage}/{totalPages}</Typography.Text>
              <div className="flex justify-end items-center flex-1">
                {currentPage < totalPages && <PrimaryButton text="Next Page" onClick={onNavigateForward}/>}
              </div>
            </div>
          )
      }
    </div>
  );
};

export default Paginator
