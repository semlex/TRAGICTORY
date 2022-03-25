const closeByClickOutside = (e, ref, setStatus, status) => {
   if (status && ref.current && !ref.current.contains(e.target)) {
      setStatus(false)
   }
}

export default closeByClickOutside