import { NodeContext } from '@/state/admin/node'
import { useFlashKey } from '@/util/useFlash'
import { useTranslation } from 'react-i18next'
import FormCard from '@/components/elements/FormCard'
import { FormProvider, useForm } from 'react-hook-form'
import Button from '@/components/elements/Button'
import Switch from '@/components/elements/inputs/Switch'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import SwitchForm from '@/components/elements/forms/SwitchForm'
import TextInputForm from '@/components/elements/forms/TextInputForm'
import { hostname, port } from '@/util/validation'
import CheckboxForm from '@/components/elements/forms/CheckboxForm'
import updateCoterm from '@/api/admin/nodes/settings/updateCoterm'
import { useState } from 'react'
import CotermTokenModal from '@/components/admin/nodes/settings/partials/general/CotermTokenModal'
import CotermResetModal from '@/components/admin/nodes/settings/partials/general/CotermResetModal'
import FlashMessageRender from '@/components/elements/FlashMessageRenderer'

const CotermCard = () => {
    const node = NodeContext.useStoreState(state => state.node.data!)
    const setNode = NodeContext.useStoreActions(actions => actions.node.setNode)
    const { clearFlashes, clearAndAddHttpError } = useFlashKey(`admin.nodes.${node.id}.settings.general.coterm`)
    const { t: tStrings } = useTranslation('strings')
    const { t } = useTranslation('admin.nodes.settings')
    const [token, setToken] = useState<string | null>(null)
    const [showResetModal, setShowResetModal] = useState<boolean>(false)

    const schemaIfEnabled = z.object({
        isEnabled: z.literal(true),
        fqdn: hostname().max(191).nonempty(),
        port: z.preprocess(Number, port()),
        isTlsEnabled: z.boolean(),
    })

    const schemaIfDisabled = z.object({
        isEnabled: z.literal(false),
        fqdn: hostname().max(191),
        port: z.preprocess(Number, port()),
        isTlsEnabled: z.boolean(),
    })

    const schema = z.discriminatedUnion('isEnabled', [schemaIfEnabled, schemaIfDisabled])

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            isEnabled: node.cotermEnabled,
            fqdn: node.cotermFqdn ?? '', // fallback to empty string because null values are not allowed
            port: node.cotermPort.toString(),
            isTlsEnabled: node.cotermTlsEnabled,
        },
    })

    const isEnabled = form.watch('isEnabled')

    const submit = async (_data: any) => {
        const {fqdn, ...data} = _data as z.infer<typeof schema>
        clearFlashes()

        try {
            const details = await updateCoterm(node.id, {
                fqdn: fqdn === '' ? null : fqdn,
                ...data,
            })

            if (details.token) {
                setToken(details.token)
            }

            form.reset({
                isEnabled: details.isEnabled,
                fqdn: details.fqdn ?? '',
                port: details.port.toString(),
                isTlsEnabled: details.isTlsEnabled,
            })

            setNode({ ...node, ...details })
        } catch (e) {
            clearAndAddHttpError(e as Error)
        }
    }

    const reset = (token: string) => {
        setToken(token)
        setShowResetModal(false)
    }

    return (
        <>
            <CotermResetModal
                nodeId={node.id}
                open={showResetModal}
                onReset={reset}
                onClose={() => setShowResetModal(false)}
            />
            <CotermTokenModal value={token} onClose={() => setToken(null)} />
            <FormCard className='w-full'>
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(submit)}>
                        <FormCard.Body>
                            <FormCard.Title>{t('coterm.title')}</FormCard.Title>
                            <p className={'description-small my-3'}>{t('coterm.description')}</p>

                            <div className={'flex flex-col gap-3'}>
                                <FlashMessageRender byKey={`admin.nodes.${node.id}.settings.general.coterm`} />
                                <SwitchForm name={'isEnabled'} label={t('coterm.enable')} />
                                <div className={'flex flex-col lg:grid grid-cols-5 gap-3'}>
                                    <TextInputForm
                                        name={'fqdn'}
                                        className={'col-span-4'}
                                        label={tStrings('fqdn')}
                                        disabled={!isEnabled}
                                    />
                                    <TextInputForm
                                        name={'port'}
                                        className={'col-span-1'}
                                        label={tStrings('port')}
                                        disabled={!isEnabled}
                                    />
                                </div>
                                <div className={'flex flex-col lg:grid grid-cols-5 lg:items-center gap-3'}>
                                    <CheckboxForm
                                        className={'col-span-4'}
                                        name={'isTlsEnabled'}
                                        label={t('coterm.tls')}
                                        disabled={!isEnabled}
                                    />
                                    <Button type='button' onClick={() => setShowResetModal(true)} className={'col-span-1'} disabled={!isEnabled}>
                                        {t('coterm.reset.action')}
                                    </Button>
                                </div>
                            </div>
                        </FormCard.Body>
                        <FormCard.Footer>
                            <Button
                                loading={form.formState.isSubmitting}
                                disabled={!form.formState.isDirty}
                                type='submit'
                                variant='filled'
                                color='success'
                                size='sm'
                            >
                                {tStrings('save')}
                            </Button>
                        </FormCard.Footer>
                    </form>
                </FormProvider>
            </FormCard>
        </>
    )
}

export default CotermCard
