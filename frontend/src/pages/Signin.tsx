import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { signinUser } from "../api/signinUser";
import { Button } from "../components/Button";
import { Input } from "../components/Input";

export const Signin = () => {

  const [user, setUser] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: signinUser,
    onSuccess: (data) => {
      localStorage.setItem('token', String(data.token))
      toast.success("Signin successfully")
      navigate('/dashboard')
    },
    onError: (error: Error) => {
      toast.success(error.message)
    }
  });

  const handleSubmit = () => {
    if (!user.email || !user.password) {
      toast.error('Please fill in all fields');
      return;
    }
    mutate(user);
  };

  return (
    <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
      <div className="flex flex-col items-center rounded-md px-4 py-6 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]">
        <h1 className="text-xl font-medium mb-4">Signin</h1>
        <div className="flex flex-col gap-2 mb-4">
          <div>
            <label htmlFor="email">Email</label>
            <Input placeholder="Email" type="email" onChange={
              (e) => { setUser(prev => ({ ...prev, email: e.target.value })) }
            } />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <Input placeholder="Password" type="password" onChange={
              (e) => { setUser(prev => ({ ...prev, password: e.target.value })) }
              } />
          </div>
          <Button loading={isPending} variant={"Primary"} text={"Signin"} className={"justify-center"} onClick={handleSubmit} />
        </div>
      </div>
    </div>
  )
}
