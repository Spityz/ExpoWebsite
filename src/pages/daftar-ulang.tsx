import { ExclamationTriangleIcon } from "@heroicons/react/24/solid"
import {
    Card,
    Input,
    Checkbox,
    Button,
    Typography,
    Alert,
    Avatar,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Switch,
} from "@material-tailwind/react"
import { signIn, useSession } from "next-auth/react"
import { FormEvent, use, useState } from "react"
import { z } from "zod"
import lodash, { parseInt } from "lodash"
import { parser } from ".eslintrc.cjs"

const formDataSchema = z.object({
    name: z.string().nonempty(),
    nim: z.string().nonempty(),
    personalEmail: z.string().nonempty().email(),
    binusEmail: z.string().nonempty().email(),
})

type FormData = z.infer<typeof formDataSchema>

export default function DaftarUlang() {
    const { data: sessionData, status: authStatus } = useSession()

    const [hasAttemptedToSubmit, setHasAttemptedToSubmit] = useState(false)

    const [nameError, setNameError] = useState(false)
    const [nimError, setNimError] = useState(false)
    const [personalEmailError, setPersonalEmailError] = useState(false)
    const [binusEmailError, setBinusEmailError] = useState(false)
    const [proofOfPaymentError, setProofOfPaymentError] = useState(false)

    const [googleFormConfirmationChecked, setgoogleFormConfirmationChecked] = useState(false)
    const [registrationFeeConfirmationChecked, setregistrationFeeConfirmationChecked] =
        useState(false)

    const [successDialogOpen, setSuccessDialogOpen] = useState(false)

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        setNameError(false)
        setNimError(false)
        setPersonalEmailError(false)
        setBinusEmailError(false)
        setProofOfPaymentError(false)

        setHasAttemptedToSubmit(true)

        const data = { ...Object.fromEntries(new FormData(event.target as HTMLFormElement)) }
        console.log(data)
        const parseResult = formDataSchema.safeParse(data)

        let errorOccurred = false

        const file = data.proofOfPayment
        if (file === undefined || !(file instanceof File) || !file.type.startsWith("image/")) {
            errorOccurred = true
            setProofOfPaymentError(true)
        }

        if (!parseResult.success) {
            errorOccurred = true
            const errorPaths = parseResult.error.errors.flatMap((err) => err.path)
            if (errorPaths.includes("name")) {
                setNameError(true)
            }
            if (errorPaths.includes("nim")) {
                setNimError(true)
            }
            if (errorPaths.includes("personalEmail")) {
                setPersonalEmailError(true)
            }
            if (errorPaths.includes("binusEmail")) {
                setBinusEmailError(true)
            }
        }
        if (parseResult.success) {
            if (!Array.from(parseResult.data.nim).every((char) => char >= "0" && char <= "9")) {
                errorOccurred = true
                setNimError(true)
            }
            if (
                !parseResult.data.binusEmail.endsWith("@binus.ac.id") ||
                !(parseResult.data.binusEmail.length > "@binus.ac.id".length)
            ) {
                errorOccurred = true
                setBinusEmailError(true)
            }
        }

        if (!googleFormConfirmationChecked || !registrationFeeConfirmationChecked) {
            errorOccurred = true
        }

        if (errorOccurred) {
            return
        }

        setSuccessDialogOpen(true)
    }

    function handleSuccessDialog() {
        //
    }

    return (
        <>
            <main
                className={`flex min-h-screen w-full min-w-[400px] flex-col items-center bg-magenta py-5`}
            >
                <Card
                    className="flex max-w-md flex-col items-center bg-white p-5"
                    color="transparent"
                    shadow={false}
                >
                    <div className="flex w-full flex-row-reverse items-center">
                        <div className="flex-flow flex items-center gap-3">
                            <Typography>EN</Typography>
                            <Switch />
                            <Typography>ID</Typography>
                        </div>
                    </div>
                    <Typography variant="h3" color="blue-gray" className="font-serif">
                        Finish Registration
                    </Typography>
                    {authStatus === "authenticated" && sessionData !== null ? (
                        <>
                            <div className="flex flex-col items-center">
                                <div className="my-2 flex flex-row items-center justify-center gap-2">
                                    <Avatar src={sessionData?.user?.image ?? ""}></Avatar>
                                    <Typography variant="small">
                                        {sessionData?.user?.name ?? ""}
                                    </Typography>
                                </div>
                                <Button variant="text" onClick={() => void signIn("discord")}>
                                    Not You? Sign In Again
                                </Button>
                            </div>
                            <form
                                method="post"
                                onSubmit={handleSubmit}
                                className="mb-2 mt-4 w-80 max-w-screen-lg sm:w-96"
                            >
                                <div className="mb-4 flex flex-col gap-6">
                                    <Alert variant="ghost">
                                        <Typography variant="small">
                                            {"Don't forget to fill the "}
                                            <a
                                                className="text-cyan-90 hover:underline"
                                                href="https://binusgdc.com/Daftar-BGDC-2023"
                                            >
                                                Google Form
                                            </a>
                                        </Typography>
                                    </Alert>
                                    <Input
                                        name="name"
                                        variant="static"
                                        size="md"
                                        label="Full Name"
                                        error={nameError}
                                    />
                                    <Input
                                        name="nim"
                                        variant="static"
                                        size="md"
                                        label="NIM"
                                        error={nimError}
                                    />
                                    <Input
                                        name="personalEmail"
                                        variant="static"
                                        size="md"
                                        label="Personal Email"
                                        placeholder="username@domain"
                                        error={personalEmailError}
                                    />
                                    <Input
                                        name="binusEmail"
                                        variant="static"
                                        size="md"
                                        label="Binus Email"
                                        placeholder="name@binus.ac.id"
                                        error={binusEmailError}
                                    />
                                </div>
                                <br></br>
                                <div className="flex flex-col gap-3">
                                    <Input
                                        accept="image/*"
                                        name="proofOfPayment"
                                        label="Proof of Payment"
                                        type="file"
                                        error={proofOfPaymentError}
                                    />
                                    <Checkbox
                                        label={
                                            <Typography
                                                variant="small"
                                                color="gray"
                                                className="font-normal"
                                            >
                                                {"I have filled in the "}
                                                <a
                                                    className="text-cyan-90 hover:underline"
                                                    href="https://binusgdc.com/Daftar-BGDC-2023"
                                                >
                                                    Google Form
                                                </a>{" "}
                                                {" with matching info"}.
                                            </Typography>
                                        }
                                        containerProps={{ className: "-ml-2.5" }}
                                        onChange={(e) =>
                                            setgoogleFormConfirmationChecked(e.target.checked)
                                        }
                                    />
                                    <Checkbox
                                        label={
                                            <Typography
                                                variant="small"
                                                color="gray"
                                                className="flex items-center font-normal"
                                            >
                                                I have paid the registration fee and submitted valid
                                                proof.
                                            </Typography>
                                        }
                                        containerProps={{ className: "-ml-2.5" }}
                                        onChange={(e) =>
                                            setregistrationFeeConfirmationChecked(e.target.checked)
                                        }
                                    />
                                </div>

                                {hasAttemptedToSubmit &&
                                (!googleFormConfirmationChecked ||
                                    !registrationFeeConfirmationChecked) ? (
                                    <Alert
                                        color="red"
                                        icon={<ExclamationTriangleIcon className="h-5 w-5" />}
                                        className="my-2"
                                    >
                                        {!googleFormConfirmationChecked
                                            ? "Fill in the google form before completing registration"
                                            : "Please submit valid proof of payment"}
                                    </Alert>
                                ) : (
                                    <></>
                                )}
                                <Button color="orange" type="submit" className="mt-6" fullWidth>
                                    Complete My Registration
                                </Button>
                            </form>
                        </>
                    ) : authStatus === "unauthenticated" ? (
                        <div className="p-10">
                            <Button color="teal" onClick={() => void signIn("discord")}>
                                To continue, please sign in with Discord
                            </Button>
                        </div>
                    ) : (
                        <></>
                    )}
                </Card>
            </main>
            <Dialog
                open={successDialogOpen}
                handler={handleSuccessDialog}
                className="bg-magenta py-5"
            >
                <DialogHeader>
                    <Typography variant="h4" className="w-full text-center text-white">
                        {" "}
                        Registration Complete!{" "}
                    </Typography>{" "}
                </DialogHeader>
                <DialogBody className="flex flex-col items-center">
                    <Button color="orange">
                        <a href="https://binusgdc.com/Discord">Take me to BGDC Server</a>
                    </Button>
                </DialogBody>
            </Dialog>
        </>
    )
}
