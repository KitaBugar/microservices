'use client'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect, useRef, useState } from "react"
import { createMethodPayment, getMethod, getUser, updateUser, uploadKTP } from "@/lib/api/user"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import Image from "next/image"
import { ApiUrl, Url } from "@/config/config"
import { toast, useToast } from "@/hooks/use-toast"

type MethodPaymentData = {
  id: number;
  name?: string;
  account_number?: string;
}
type UserData = {
  id?: number;
  avatar?: string;
  name?: string;
  email?: string;
  phone_number?: string;
  identify?: string;
  identify_status?: string;
  gender?: string;
  method_payment?: MethodPaymentData;
}
type MethodData = {
  id: number;
  image: string;
  name: string;
}

export default function Setting() {
  const [account, setAccount] = useState<UserData | null>(null)
  const [method, setMethod] = useState<MethodData[] | null>(null);
  const ktpInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast()
  
  async function getData (){
    try {
     const resUser = await getUser()
     const resMethod = await getMethod()
     setAccount(resUser?.items)
     setMethod(resMethod?.items)
     console.log(resUser.items);
     
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSaveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget);
    try {
      const response = await updateUser(formData)
      getData()
      toast({
        title: "Berhasil mengubah profile",
      })   
    } catch (error) {
      
    }
  }
    
  async function handleSaveKTP(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget);
    try {
      await uploadKTP(formData)
      getData()
      if (ktpInputRef.current) {
        ktpInputRef.current.value = "";
      }
    } catch (error) {
     console.log(error);
    }
  }  

  async function handleMethod(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    try {
      const formData = new FormData(e.currentTarget);
      await createMethodPayment(formData)
      toast({
        title: "Berhasil menambahkan metode pembayaran",
      })    
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getData()
  },[])
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
    <Tabs defaultValue="account" className="w-[500px]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="account">Akun</TabsTrigger>
        <TabsTrigger value="ktp">Upload KTP</TabsTrigger>
        <TabsTrigger value="metode-pembayaran" disabled={(account?.identify_status == "success") ? false : true}>Metode Pembayaran</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <form onSubmit={handleSaveProfile}>
          <CardHeader>
            <CardTitle>Akun</CardTitle>
            <CardDescription>
                Ubah informasimu dengan benar agar proses selanjutnya dapat diakses.
            </CardDescription>
          </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input id="name" name="name" defaultValue={account?.name}  />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" disabled={true} defaultValue={account?.email} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone_number">Nomor HP</Label>
                <Input id="phone_number" name="phone_number" type="number" defaultValue={account?.phone_number} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone_number">Jenis Kelamin</Label>
                <Select value={account?.gender}  onValueChange={(val) => setAccount({ ...account, gender: val })} name="gender">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Pilih Jenis Kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="laki-laki">Laki-Laki</SelectItem>
                      <SelectItem value="perempuan">Perempuan</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">Simpan Perubahan</Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
      <TabsContent value="ktp">
        <Card>
          <CardHeader>
            <CardTitle>Upload KTP</CardTitle>
            <CardDescription>
              Silahkan upload KTP untuk mempermudah akses selanjutnya
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSaveKTP} encType="multipart/form-data">
            <div className="mx-auto w-[450px] overflow-hidden">
              <AspectRatio ratio={24 / 9}>
                <Image src={`${Url}/assets/ktp/${account?.identify}`} alt="Image" className="rounded-md object-cover" width={450} height={300} />
              </AspectRatio>
            </div>
              {
                account?.identify_status == ""  || account?.identify_status == "cancel" ? (
                <>
                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                      {
                        account.identify_status == "cancel" ? 
                        <>
                        <small>Mohon maaf verifikasi ktp gagal, silahkan masukkan kembali ktpmu dengan benar</small> <br />
                        </>
                        : <></>
                      }
                      <Label htmlFor="current">Masukkan KTP</Label>
                      <Input id="current" type="file" name="identify" ref={ktpInputRef} />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit">Upload</Button>
                  </CardFooter>
                </>
            ): account?.identify_status == "pending" ? <> 
                <CardContent className="space-y-2 mt-4">
                    <Label>KTP sedang diverifikasi</Label> 
                </CardContent>
             </> :  <></>
            }
          </form>
          {
            account?.identify_status == "success" ? (
              <>
                <CardContent className="space-y-2 mt-4">
                <Label htmlFor="current">KTP berhasil diverifikasi, silahkan lanjut proses selanjutnya</Label>
                </CardContent>
              </> 
              ) : <></>
          }
        </Card>
      </TabsContent>
      <TabsContent value="metode-pembayaran">
        <Card>
          <CardHeader>
            <CardTitle>Metode Pembayaran</CardTitle>
            <CardDescription>
              Silahkan pilih metode pembayaran untuk mempermudah transaksi pembayaran, pastikan data yang diisi benar.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleMethod}>
          <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="method">Pilih Metode Pembayaran</Label>
                <Select name="method_id" 
                value={account?.method_payment?.id.toString()} 
                onValueChange={(val) => setAccount(prev => ({ 
                  ...prev, 
                  method_payment: { ...prev?.method_payment, id: Number(val) } 
                }))}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Pilih" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {
                        method && method != undefined ? (
                          method.map((data: MethodData) => (
                            <SelectItem key={data.id} value={data.id.toString()}>{data.name}</SelectItem>
                          ))
                        ) : <></>
                      }
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            <div className="space-y-1">
              <Label htmlFor="account_number">Masukkan Nomor</Label>
              <Input id="account_number" type="text" name="account_number" defaultValue={account?.method_payment?.account_number} />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Simpan Metode Pembayaran</Button>
          </CardFooter>
          </form>
        </Card>
      </TabsContent>
    </Tabs>
    </div>
    </div>
  )
}
