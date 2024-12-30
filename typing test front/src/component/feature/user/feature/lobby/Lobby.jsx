import BackupWithInput from "./BackupWithInput"
// import OldBackup from './OldBackup'

const Lobby = () => {
  return (
    <>
      {
        window.innerWidth >= 767 ?
        (<BackupWithInput />)
        :
        (<BackupWithInput />)
      }
    </>
  )
}

export default Lobby