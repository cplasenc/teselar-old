import classNames from 'classnames';

interface InputGroupProps {
    className?: string
    type: string
    placeholder: string
    value: string
    error: string | undefined
    setValue: (str: string) => void
}

const InputGroup: React.FC<InputGroupProps> = (props) => {
    return <div className={props.className}>
    <input
      type={props.type}
      className={classNames(
        'w-full p-3 transition duration-200 border border-gray-300 rounded outline-none bg-gray-50 focus:bg-white hover:bg-white',
        { 'border-red-500': props.error }
      )}
      placeholder={props.placeholder}
      value={props.value}
      onChange={(e) => props.setValue(e.target.value)}
    />
    <small className='font-medium text-red-600'>{props.error}</small>
  </div>
}

export default InputGroup;